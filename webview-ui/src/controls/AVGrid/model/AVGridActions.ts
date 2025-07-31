import {
    CellClickEvent,
    CellDragEvent,
    CellMouseEvent,
    Column,
    TOnColumnResize,
    TOnColumnsReorder,
} from "../avGridTypes";
import { AVGridModel } from "./AVGridModel";

export class AVGridActions<R> {
    model: AVGridModel<R>;

    constructor(model: AVGridModel<R>) {
        this.model = model;
    }

    // Grid content actions

    contentMouseLeave = () => {
        this.model.events.content.onMouseLeave.send(undefined);
    };

    contentKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        this.model.events.content.onKeyDown.send(e);
    };

    contentContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        this.model.events.content.onContextMenu.send(e);
    };

    contentBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        this.model.events.content.onBlur.send(e);
    };

    // Cell actions

    cellMouseDown: CellMouseEvent = (e, row, col, rowIndex, colIndex) => {
        this.model.events.cell.onMouseDown.send({
            e,
            row,
            col,
            rowIndex,
            colIndex,
        });
    };

    cellDragStart: CellDragEvent = (e, row, col, rowIndex, colIndex) => {
        this.model.events.cell.onDragStart.send({
            e,
            row,
            col,
            rowIndex,
            colIndex,
        });
    };

    cellDragEnter: CellDragEvent = (e, row, col, rowIndex, colIndex) => {
        this.model.events.cell.onDragEnter.send({
            e,
            row,
            col,
            rowIndex,
            colIndex,
        });
    };

    cellDragEnd: CellDragEvent = (e, row, col, rowIndex, colIndex) => {
        this.model.events.cell.onDragEnd.send({
            e,
            row,
            col,
            rowIndex,
            colIndex,
        });
    };

    cellClick: CellClickEvent = (row, col, rowIndex, colIndex) => {
        this.model.events.cell.onClick.send({ row, col, rowIndex, colIndex });
    };

    cellDoubleClick = (row: any, col: Column) => {
        this.model.events.cell.onDoubleClick.send({ row, col });
    };

    // Column header actions

    sortColumn = (columnKey: string | keyof R) => {
        if (this.model.props.disableSorting) {
            return;
        }
        if (this.model.data.rowsFrozen) {
            this.model.models.rows.unfreezeRows();
            return;
        }

        this.model.models.sortColumn.sortColumn(columnKey);
    };

    columnResize: TOnColumnResize = (columnKey: string, width: number) => {
        this.model.events.onColumnResize.send({ columnKey, width });
    };

    columnsReorder: TOnColumnsReorder = (
        sourceKey: string,
        targetKey: string
    ) => {
        this.model.events.onColumnsReorder.send({ sourceKey, targetKey });
    };

    // Internal actions

    columnsChanged = () => {
        this.model.events.onColumnsChanged.send(undefined);
    };

    editRow = (columnKey: string, rowKey: string, value: any) => {
        if (!this.model.props.editRow) return;

        const newRowEdited = this.model.data.newRowKey === rowKey;
        if (newRowEdited) {
            this.model.data.newRowKey = undefined;
        }
        this.model.props.editRow(columnKey, rowKey, value);

        if (newRowEdited) {
            Promise.resolve().then(() => this.model.data.change());
        }
    };

    addRows = (count: number, insertIndex?: number, withFocus?: boolean, isTempRow?: boolean): R[] => {
        if (!this.model.props.onAddRows) return [];
        const { searchString, filters } = this.model.props;
        const sortColumn = this.model.state.get().sortColumn;
        if (searchString?.length || filters?.length || sortColumn) {
            this.model.models.rows.freezeRows();
        }

        const rowsPosition = insertIndex ?? this.model.data.rows.length;
        const oldFocus = this.model.props.focus;
        
        this.model.flags.noScrollOnFocus = true;
        const rows = this.model.props.onAddRows(count, insertIndex);
        this.model.events.onRowsAdded.send({ rows, insertIndex });

        if (withFocus) {
            Promise.resolve().then(() => {
                this.model.models.focus.focusNewRows(rowsPosition, count, oldFocus);
                if (insertIndex === undefined) {
                    this.model.renderModel?.scrollToRow(this.model.data.rows.length);
                }
            });
        }

        if (!isTempRow) {
            setTimeout(() => { this.model.props.onDataChanged?.(); }, 0);
        }

        return rows;
    };

    addNewRow = (withFocus?: boolean, isTempRow?: boolean) => {
        const rows = this.addRows(1, undefined, withFocus, isTempRow);
        if (isTempRow) {
            this.model.data.newRowKey = this.model.props.getRowKey(rows[0]);
            this.model.data.change();
        }
        return rows;
    };

    deleteRows = (rowKeys: string[]): void => {
        if (!this.model.props.onDeleteRows) return;

        this.model.props.onDeleteRows(rowKeys);
        this.model.events.onRowsDeleted.send({ rowKeys });

        setTimeout(() => { this.model.props.onDataChanged?.(); }, 0);
    };
}
