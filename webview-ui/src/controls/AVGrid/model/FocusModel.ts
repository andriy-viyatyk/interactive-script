import clsx from "clsx";
import { range } from "../../../common/utils/utils";
import { CellFocus, Column } from "../avGridTypes";
import { AVGridDataChangeEvent } from "./AVGridData";
import { AVGridModel } from "./AVGridModel";

type SelType = "click" | "shiftClick" | "rightClick" | "startDrag" | "drag";

function getSelectionRange(focus?: CellFocus) {
    let res = {
        rowStart: -1,
        rowEnd: -1,
        colStart: -1,
        colEnd: -1,
    };
    if (focus && focus.selection) {
        const rowRange = [
            focus.selection.rowStart,
            focus.selection.rowEnd,
        ].sort((a, b) => a - b);
        const colRange = [
            focus.selection.colStart,
            focus.selection.colEnd,
        ].sort((a, b) => a - b);
        res = {
            rowStart: rowRange[0],
            rowEnd: rowRange[1],
            colStart: colRange[0],
            colEnd: colRange[1],
        };
    }
    return res;
}

function inSelection(col: number, row: number, focus?: CellFocus) {
    const selection = getSelectionRange(focus);
    return (
        row >= selection.rowStart &&
        row <= selection.rowEnd &&
        col >= selection.colStart &&
        col <= selection.colEnd
    );
}

export class FocusModel<R> {
    readonly model: AVGridModel<R>;

    constructor(model: AVGridModel<R>) {
        this.model = model;
        this.model.data.onChange.subscribe(this.onDataChange);
        this.model.events.cell.onMouseDown.subscribe(this.onCellMouseDown);
        this.model.events.cell.onDragStart.subscribe(this.onCellDragStart);
        this.model.events.cell.onDragEnter.subscribe(this.onCellDragEnter);
        this.model.events.cell.onDragEnd.subscribe(this.onCellDragEnd);
        this.model.events.content.onKeyDown.subscribe(this.onContentKeyDown);
    }

    focusClass = (col: number, row: number) => {
        const { columns, rows } = this.model.data;
        const { getRowKey, focus } = this.model.props;

        const column = columns[col];
        const focused =
            focus?.rowKey === getRowKey(rows[row]) &&
            focus?.columnKey === column.key;
        const selection = focus?.selection;
        const rRange = [
            selection?.rowStart ?? -1,
            selection?.rowEnd ?? -1,
        ].sort((a, b) => a - b);
        const cRange = [
            selection?.colStart ?? -1,
            selection?.colEnd ?? -1,
        ].sort((a, b) => a - b);

        return clsx({
            focused,
            inSelection:
                row >= rRange[0] &&
                row <= rRange[1] &&
                col >= cRange[0] &&
                col <= cRange[1],
            inSelectionTop:
                row === rRange[0] && col >= cRange[0] && col <= cRange[1],
            inSelectionBottom:
                row === rRange[1] && col >= cRange[0] && col <= cRange[1],
            inSelectionLeft:
                col === cRange[0] && row >= rRange[0] && row <= rRange[1],
            inSelectionRight:
                col === cRange[1] && row >= rRange[0] && row <= rRange[1],
        });
    };

    focusCell = (rowIndex: number, colIndex: number, withScroll?: boolean) => {
        const { columns, rows } = this.model.data;

        if (
            rowIndex < 0 ||
            rowIndex >= rows.length ||
            colIndex < 0 ||
            colIndex >= columns.length
        ) {
            return;
        }

        const row = rows[rowIndex];
        const col = columns[colIndex];

        this.updateFocus(row, col, rowIndex, colIndex, "click", withScroll);
    };

    selectRange = (
        startRowIndex: number,
        startColIndex: number,
        endRowIndex: number,
        endColIndex: number
    ) => {
        const { getRowKey, setFocus } = this.model.props;
        const { columns, rows } = this.model.data;
        const startCol = columns[startColIndex];
        const endCol = columns[endColIndex];
        const startRow = rows[startRowIndex];
        const endRow = rows[endRowIndex];
        if (startCol && endCol && startRow && endRow && setFocus) {
            setFocus({
                columnKey: endCol.key,
                rowKey: getRowKey(endRow),
                isDragging: false,
                selection: {
                    colKeyStart: startCol.key,
                    rowKeyStart: getRowKey(startRow),
                    colKeyEnd: endCol.key,
                    rowKeyEnd: getRowKey(endRow),
                    colStart: startColIndex,
                    rowStart: startRowIndex,
                    colEnd: endColIndex,
                    rowEnd: endRowIndex,
                },
            });
            this.model.update({ all: true });
        }
    };

    focusNewRows = (startIndex: number, count: number, oldFocus?: CellFocus<R>) => {
        const endRowIndex = startIndex + count - 1;
        const startColIndex = oldFocus?.selection?.colStart ?? 0;
        const endColIndex = oldFocus?.selection?.colEnd ?? 0;
        this.selectRange(
            startIndex,
            startColIndex,
            endRowIndex,
            endColIndex
        );
    }

    getGridFocus = () => {
        const { focus, getRowKey } = this.model.props;
        const { rows, columns } = this.model.data;

        if (focus && focus.columnKey && focus.rowKey) {
            const rowIndex = rows.findIndex(
                (r) => getRowKey(r) === focus.rowKey
            );
            const colIndex = columns.findIndex(
                (c) => c.key === focus.columnKey
            );
            return {
                row: rows[rowIndex],
                column: columns[colIndex],
                rowIndex,
                colIndex,
            };
        }
    };

    getGridSelection = () => {
        const { focus, getRowKey } = this.model.props;
        const { rows, columns } = this.model.data;

        if (focus && focus.columnKey && focus.rowKey) {
            const endRowIndex = rows.findIndex(
                (r) => getRowKey(r) === focus.rowKey
            );
            const endColIndex = columns.findIndex(
                (c) => c.key === focus.columnKey
            );
            const startRowIndex = focus.selection?.rowKeyStart
                ? rows.findIndex(
                      (r) => getRowKey(r) === focus.selection?.rowKeyStart
                  )
                : endRowIndex;
            const startColIndex = focus.selection?.colKeyStart
                ? columns.findIndex(
                      (c) => c.key === focus.selection?.colKeyStart
                  )
                : endColIndex;
            const rowRange = [startRowIndex, endRowIndex].sort((a, b) => a - b);
            const colRange = [startColIndex, endColIndex].sort((a, b) => a - b);

            return {
                rows: rows.slice(rowRange[0], rowRange[1] + 1),
                columns: columns.slice(colRange[0], colRange[1] + 1),
                focusCol: endColIndex,
                focusRow: endRowIndex,
                rowRange,
                colRange,
            };
        }
    };

    private onDataChange = (e?: AVGridDataChangeEvent) => {
        if (!e) return;
        if (e.rows || e.columns) {
            this.validateFocus();
        }
    };

    private updateFocus = (
        row: any,
        col: Column,
        rowIndex: number,
        colIndex: number,
        selType: SelType,
        withScroll?: boolean
    ) => {
        const getRowKey = this.model.props.getRowKey;
        const rows = this.model.data.rows;

        this.model.props.setFocus?.((foc) => {
            if (selType === "drag" && !foc?.isDragging) {
                return foc;
            }

            if (
                selType === "rightClick" &&
                inSelection(colIndex, rowIndex, foc)
            ) {
                return foc;
            }

            let oldRow = -1;
            const rowRange =
                this.model.renderModel?.renderInfo.current?.renderRange.rows;
            if (foc && this.model.renderModel && rowRange) {
                // skip header (r === 0)
                oldRow =
                    rowRange.find(
                        (r) => r > 0 && getRowKey(rows[r - 1]) === foc.rowKey
                    ) ?? -1;
            }

            this.model.renderModel?.update({
                rows: oldRow < 0 ? [rowIndex + 1] : [oldRow, rowIndex + 1],
            });

            if (withScroll) {
                Promise.resolve().then(() => {
                    this.model.renderModel?.scrollTo(rowIndex + 1, colIndex);
                });
            }

            const currentSel = {
                rowKeyEnd: getRowKey(row),
                colKeyEnd: col.key as keyof R,
                rowEnd: rowIndex,
                colEnd: colIndex,
            };

            const startSel =
                selType === "startDrag" ||
                selType === "click" ||
                selType === "rightClick" ||
                (selType === "shiftClick" && !foc?.selection) ||
                !foc?.selection
                    ? {
                          rowKeyStart: getRowKey(row),
                          colKeyStart: col.key as keyof R,
                          rowStart: rowIndex,
                          colStart: colIndex,
                      }
                    : {
                          rowKeyStart: foc.selection.rowKeyStart,
                          colKeyStart: foc.selection.colKeyStart,
                          rowStart: foc.selection.rowStart,
                          colStart: foc.selection.colStart,
                      };

            const oldSel = foc?.selection;

            if (oldSel) {
                const edges = [
                    oldSel.rowStart,
                    oldSel.rowEnd,
                    currentSel.rowEnd,
                ];
                const min = Math.min(...edges) + 1;
                const max = Math.max(...edges) + 1;
                this.model.update({ rows: range(min, max) });
            }

            return {
                rowKey: currentSel.rowKeyEnd,
                columnKey: currentSel.colKeyEnd,
                isDragging: selType === "startDrag" || Boolean(foc?.isDragging),
                selection: {
                    ...currentSel,
                    ...startSel,
                },
            };
        });
    };

    private validateFocus = () => {
        const getRowKey = this.model.props.getRowKey;
        const { rows, columns } = this.model.data;

        this.model.props.setFocus?.((oldFocus) => {
            if (oldFocus) {
                const rowIndex = rows.findIndex(
                    (r) => getRowKey(r) === oldFocus.rowKey
                );
                const colIndex = columns.findIndex(
                    (c) => c.key === oldFocus.columnKey
                );
                if (rowIndex < 0 || colIndex < 0) {
                    return undefined;
                }
                const oldSelection = oldFocus.selection;
                if (oldSelection) {
                    const startRowIndex = rows.findIndex(
                        (r) => getRowKey(r) === oldSelection.rowKeyStart
                    );
                    const startColIndex = columns.findIndex(
                        (c) => c.key === oldSelection.colKeyStart
                    );
                    if (
                        startRowIndex !== oldSelection.rowStart ||
                        startColIndex !== oldSelection.colStart ||
                        rowIndex !== oldSelection.rowEnd ||
                        colIndex !== oldSelection.colEnd
                    ) {
                        this.model.renderModel?.update({ all: true });
                        this.model.renderModel?.scrollToRow(
                            rowIndex + 1,
                            "center"
                        );
                        return {
                            ...oldFocus,
                            selection: {
                                ...oldSelection,
                                rowStart: rowIndex,
                                colStart: colIndex,
                                rowEnd: rowIndex,
                                colEnd: colIndex,
                            },
                        };
                    }
                }
            }
            return oldFocus;
        });
    };

    private onCellMouseDown = (data?: {
        e: React.MouseEvent<HTMLDivElement>;
        row: any;
        col: Column;
        rowIndex: number;
        colIndex: number;
    }) => {
        if (!data) return;
        this.updateFocus(
            data.row,
            data.col,
            data.rowIndex,
            data.colIndex,
            data.e.shiftKey
                ? "shiftClick"
                : data.e.button === 0
                ? "click"
                : "rightClick"
        );
    };

    private onCellDragStart = (data?: {
        e: React.DragEvent<HTMLDivElement>;
        row: any;
        col: Column;
        rowIndex: number;
        colIndex: number;
    }) => {
        if (!data) return;
        if (this.model.props.setFocus) {
            const img = new Image();
            img.src =
                "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
            data.e.dataTransfer.setDragImage(img, 0, 0);
            data.e.dataTransfer.setData("text/plain", "cell-sel");
        }
        this.updateFocus(
            data.row,
            data.col,
            data.rowIndex,
            data.colIndex,
            "startDrag"
        );
    };

    private onCellDragEnter = (data?: {
        e: React.DragEvent<HTMLDivElement>;
        row: any;
        col: Column;
        rowIndex: number;
        colIndex: number;
    }) => {
        if (!data) return;
        data.e.preventDefault();
        data.e.dataTransfer.dropEffect = "move";
        this.updateFocus(
            data.row,
            data.col,
            data.rowIndex,
            data.colIndex,
            "drag"
        );
    };

    private onCellDragEnd = (data?: {
        e: React.DragEvent<HTMLDivElement>;
        row: any;
        col: Column;
        rowIndex: number;
        colIndex: number;
    }) => {
        if (!data) return;
        this.model.props.setFocus?.((foc) =>
            foc ? { ...foc, isDragging: false } : undefined
        );
    };

    private onContentKeyDown = (e?: React.KeyboardEvent<HTMLDivElement>) => {
        if (!e) return;

        const { getRowKey, focus } = this.model.props;
        const { rows: dataRows, columns } = this.model.data;
        let rows = dataRows;

        if (
            ["ArrowLeft", "ArrowRight"].includes(e.key) &&
            this.model.models.editing.isEditing
        ) {
            return;
        }

        if (
            ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab"].includes(
                e.key
            )
        ) {
            e.preventDefault();
            e.stopPropagation();
            let rowIndex = rows.findIndex(
                (r) => getRowKey(r) === focus?.rowKey
            );
            let columnIndex = columns.findIndex(
                (c) => c.key === focus?.columnKey
            );
            if (rowIndex >= 0 && columnIndex >= 0) {
                switch (e.key) {
                    case "ArrowDown":
                        if (rowIndex < rows.length - 1) {
                            rowIndex++;
                        } else if (
                            rowIndex === rows.length - 1 &&
                            this.model.props.onAddRows &&
                            (!this.model.data.newRowKey ||
                                (this.model.models.editing.isEditing &&
                                    this.model.state.get().cellEdit?.rowKey ===
                                        this.model.data.newRowKey))
                        ) {
                            if (this.model.models.editing.isEditing) {
                                this.model.models.editing.closeEdit(true, true);
                            }
                            rows = [
                                ...rows,
                                ...this.model.actions.addNewRow(false, true),
                            ];
                            rowIndex++;
                        }
                        break;
                    case "ArrowUp":
                        if (rowIndex > 0) {
                            rowIndex--;
                        }
                        break;
                    case "ArrowLeft":
                        if (columnIndex > 0) {
                            columnIndex--;
                        }
                        break;
                    case "ArrowRight":
                        if (columnIndex < columns.length - 1) {
                            columnIndex++;
                        }
                        break;
                    case "Tab": {
                        columnIndex =
                            columnIndex < columns.length - 1
                                ? columnIndex + 1
                                : 0;

                        if (
                            columnIndex === 0 &&
                            rowIndex === rows.length - 1 &&
                            this.model.props.onAddRows &&
                            !this.model.data.newRowKey
                        ) {
                            rows = [
                                ...rows,
                                ...this.model.actions.addNewRow(false, true),
                            ];
                            rowIndex++;
                        } else {
                            rowIndex =
                                columnIndex === 0 && rowIndex < rows.length - 1
                                    ? rowIndex + 1
                                    : rowIndex;
                        }
                        break;
                    }
                    default:
                        break;
                }
                this.updateFocus(
                    rows[rowIndex],
                    columns[columnIndex],
                    rowIndex,
                    columnIndex,
                    e.shiftKey && e.key !== "Tab" ? "shiftClick" : "click",
                    true
                );
            }
        }

        if (e.ctrlKey && focus && e.code === "KeyA") {
            e.preventDefault();
            e.stopPropagation();
            const { rows, columns } = this.model.data;
            this.selectRange(0, 0, rows.length - 1, columns.length - 1);
        }
    };
}
