import { CellClickEvent, CellDragEvent, CellMouseEvent, Column, TOnColumnResize, TOnColumnsReorder } from "../avGridTypes";
import { AVGridModel } from "./AVGridModel";

export class AVGridActions<R> {
    model: AVGridModel<R>;

    constructor(model: AVGridModel<R>) {
        this.model = model;
    }

    // Grid content actions

    contentMouseLeave = () => {
        this.model.events.content.onMouseLeave.send(undefined);
    }

    contentKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        this.model.events.content.onKeyDown.send(e);
    }

    contentContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        this.model.events.content.onContextMenu.send(e);
    }

    contentBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        this.model.events.content.onBlur.send(e);
    }

    // Cell actions

    cellMouseDown: CellMouseEvent = (e, row, col, rowIndex, colIndex) => {
        this.model.events.cell.onMouseDown.send({e, row, col, rowIndex, colIndex});
    }

    cellDragStart: CellDragEvent = (e, row, col, rowIndex, colIndex) => {
        this.model.events.cell.onDragStart.send({e, row, col, rowIndex, colIndex});
    }

    cellDragEnter: CellDragEvent = (e, row, col, rowIndex, colIndex) => {
        this.model.events.cell.onDragEnter.send({e, row, col, rowIndex, colIndex});
    }

    cellDragEnd: CellDragEvent = (e, row, col, rowIndex, colIndex) => {
        this.model.events.cell.onDragEnd.send({e, row, col, rowIndex, colIndex});
    }

    cellClick: CellClickEvent = (row, col, rowIndex, colIndex) => {
        this.model.events.cell.onClick.send({row, col, rowIndex, colIndex});
    }

    cellDoubleClick = (row: any, col: Column) => {
        this.model.events.cell.onDoubleClick.send({row, col});
    }

    // Column header actions

    sortColumn = (columnKey: string | keyof R) => {
        if (this.model.props.disableSorting) {
            return;
        }

        this.model.models.sortColumn.sortColumn(columnKey);
    }

    columnResize: TOnColumnResize = (columnKey: string, width: number) => {
        this.model.events.onColumnResize.send({columnKey, width});
    }

    columnsReorder: TOnColumnsReorder = (sourceKey: string, targetKey: string) => {
        this.model.events.onColumnsReorder.send({sourceKey, targetKey});
    }

    // Internal actions

    columnsChanged = () => {
        this.model.events.onColumnsChanged.send(undefined);
    }
}