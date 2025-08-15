import { useEffect } from "react";
import { CellFocus, Column } from "../avGridTypes";
import { AVGridModel } from "./AVGridModel";
import { gridBoolean } from "../avGridUtils";

export class EditingModel<R> {
    readonly model: AVGridModel<R>;

    constructor(model: AVGridModel<R>) {
        this.model = model;
        this.model.events.content.onKeyDown.subscribe(this.onContentKeyDown);
        this.model.events.content.onBlur.subscribe(this.onContentBlur);
        this.model.events.cell.onMouseDown.subscribe(this.onCellMouseDown);
    }

    get isEditing() {
        const cellEdit = this.model.state.get().cellEdit;
        return Boolean(cellEdit.columnKey && cellEdit.rowKey);
    }

    isFocusEditing = (focus?: CellFocus<R>) => {
        const cellEdit = this.model.state.get().cellEdit;
        return Boolean(cellEdit.columnKey && cellEdit.rowKey && cellEdit.columnKey === focus?.columnKey && cellEdit.rowKey === focus?.rowKey);
    }

    useModel = () => {
        const { focus } = this.model.props;

        useEffect(() => {
            const editState = this.model.state.get().cellEdit;
            if (
                focus &&
                editState.columnKey &&
                (focus.columnKey !== editState.columnKey ||
                    focus.rowKey !== editState.rowKey)
            ) {
                this.closeEdit(true);
            }
        }, [focus]);
    }

    editCell = (col: Column<R>, row: R, val: any) => {
        if (!this.model.props.editRow || col.readonly) return;
        this.model.models.rows.freezeRows();

        const value = col.validate ? col.validate(col, row, val) : val;
        this.model.actions.editRow(col.key.toString(), this.model.props.getRowKey(row), value);
    }

    deleteRange = () => {
        const gridSelection = this.model.models.focus.getGridSelection();
        if (gridSelection) {
            gridSelection.columns.forEach((col) => {
                if (this.model.props.editRow && !col.readonly) {
                    gridSelection.rows.forEach((row) => {
                        this.editCell(col, row, undefined);
                        this.model.dataChanged();
                    });
                }
            });
        }
    }

    closeEdit = (commit: boolean, focusGrid: boolean = true) => {
        const { getRowKey } = this.model.props;
        const { rows, columns } = this.model.data;
        const editState = this.model.state.get().cellEdit;
        let rowIndex = -1;

        if (editState.rowKey && editState.columnKey) {
            rowIndex = rows.findIndex(
                (r) => getRowKey(r) === editState.rowKey
            );
            const row = rows[rowIndex];
            const column = columns.find(
                (c) => c.key === editState.columnKey
            );
            if (commit && column && row && editState.changed) {
                this.editCell(column, row, editState.value);
                this.model.dataChanged();
            }
        }
        this.model.state.update(s => {
            s.cellEdit = { columnKey: "", rowKey: "", value: undefined, changed: false };
        })

        if (rowIndex >= 0) {
            this.model.renderModel?.update({ rows: [rowIndex + 1] });
            if (focusGrid) {
                this.model.renderModel?.gridRef.current?.focus();
            }
        }
    }

    openEdit = (
        columnKey: keyof R | string,
        rowKey: string,
        value: any,
        dontSelect: boolean
    ) => {
        const cellState = this.model.state.get().cellEdit;
        const cellValue =
            cellState.columnKey === columnKey && cellState.rowKey === rowKey
                ? cellState.value
                : "";
        this.model.data.editTime = new Date().getTime();
        this.model.data.change();
        this.model.state.update(s => {
            s.cellEdit = {
                columnKey,
                rowKey,
                value: `${cellValue ?? ""}${value ?? ""}`,
                dontSelect,
                changed: false,
            }
        });
    }

    preventEditorBlur = () => {
        this.model.data.editTime = new Date().getTime();
    }

    private getCellForEdit = () => {
        const { editRow, readonly } = this.model.props;

        const gridFocus = editRow
            ? this.model.models.focus.getGridFocus()
            : undefined;

        if (gridFocus && gridFocus.rowIndex >= 0) {
            this.model.renderModel?.update({ rows: [gridFocus.rowIndex + 1] });
        }

        return gridFocus &&
            !readonly &&
            !gridFocus.column.readonly &&
            gridFocus.row
            ? {
                column: gridFocus.column,
                row: gridFocus.row,
                rowIndex: gridFocus.rowIndex,
            }
            : { column: undefined, row: undefined, rowIndex: -1 };
    }

    private editBooleanInSelection = (focusValue: any, isEnter: boolean) => {
        const selection = this.model.models.focus.getGridSelection();
        if (!selection) return;
        if (!selection.columns.every(c => c.dataType === "boolean")) return;
        focusValue = gridBoolean(focusValue);

        for (const row of selection.rows) {
            for (const col of selection.columns) {
                const currentValue = gridBoolean(row[col.key as keyof R]);
                this.editCell(col, row, isEnter ? !focusValue : !currentValue);
            }
        }
        this.model.dataChanged();
    }

    private onContentKeyDown = (e?: React.KeyboardEvent<HTMLDivElement>) => {
        if (!e) return;
        const { focus } = this.model.props;

        if (
            [
                "Enter",
                "F2",
                "Space",
                "Delete",
                "Escape",
                "ArrowLeft",
                "ArrowRight",
            ].includes(e.code) &&
            focus
        ) {
            const { column, row } = this.getCellForEdit();
            if (row && column) {
                const editState = this.model.state.get().cellEdit;
                switch (e.code) {
                    case "Enter":
                    case "F2":
                        if (
                            editState.columnKey === focus.columnKey &&
                            editState.rowKey === focus.rowKey
                        ) {
                            this.closeEdit(true);
                        } else if (column.dataType !== "boolean") {
                            this.openEdit(
                                focus.columnKey,
                                focus.rowKey,
                                row[column.key as keyof R],
                                false
                            );
                        } else if (column.dataType === "boolean" && e.code === "Enter") {
                            this.editBooleanInSelection(row[column.key as keyof R], true);
                        }
                        break;
                    case "Delete":
                        this.deleteRange();
                        break;
                    case "Escape":
                        this.closeEdit(false);
                        break;
                    case "Space":
                        if (column.dataType === "boolean") {
                            this.editBooleanInSelection(row[column.key as keyof R], false);
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        if (
            e.key.length === 1 &&
            !e.ctrlKey &&
            !e.altKey &&
            !e.metaKey &&
            focus
        ) {
            const { column } = this.getCellForEdit();
            if (column && column.dataType !== "boolean") {
                this.openEdit(focus.columnKey, focus.rowKey, "", true); // e.key
            }
        }
    }

    private onCellMouseDown = (data?: { e: React.MouseEvent<HTMLDivElement>, row: any, col: Column, rowIndex: number, colIndex: number }) => {
        if (!data) return;
        const { focus, getRowKey } = this.model.props;
        if (
            data.e.button === 0 &&
            focus &&
            focus.columnKey === data.col.key &&
            focus.rowKey === getRowKey(data.row)
        ) {
            const editState = this.model.state.get().cellEdit;
            if (
                editState.columnKey !== focus.columnKey &&
                editState.rowKey !== focus.rowKey
            ) {
                const { column } = this.getCellForEdit();
                if (column && column.dataType !== "boolean") {
                    data.e.stopPropagation();
                    data.e.preventDefault();
                    this.openEdit(
                        focus.columnKey,
                        focus.rowKey,
                        data.row[data.col.key],
                        true
                    );
                }
            }
        }
    }

    private onContentBlur = () => {
        // allow blur to transfer focus to cell input
        if (this.model.data.editTime + 50 < new Date().getTime()) {
            this.closeEdit(true, false);
        }
    }
}