import { Subscription } from "../../../common/classes/events";
import { CellClickEvent, CellDragEvent, CellMouseEvent, Column, TOnColumnResize, TOnColumnsReorder } from "../avGridTypes";

class CellEvents {
    onClick = new Subscription<{row: any, col: Column, rowIndex: number, colIndex: number}>();
    onMouseDown = new Subscription<{e: React.MouseEvent<HTMLDivElement>, row: any, col: Column, rowIndex: number, colIndex: number}>();
    onDoubleClick = new Subscription<{row: any, col: Column}>();
    onDragStart = new Subscription<{e: React.DragEvent<HTMLDivElement>, row: any, col: Column, rowIndex: number, colIndex: number}>();
    onDragEnter = new Subscription<{e: React.DragEvent<HTMLDivElement>, row: any, col: Column, rowIndex: number, colIndex: number}>();
    onDragEnd = new Subscription<{e: React.DragEvent<HTMLDivElement>, row: any, col: Column, rowIndex: number, colIndex: number}>();

    click: CellClickEvent = (row, col, rowIndex, colIndex) => {
        this.onClick.send({row, col, rowIndex, colIndex});
    }

    mouseDown: CellMouseEvent = (e, row, col, rowIndex, colIndex) => {
        this.onMouseDown.send({e, row, col, rowIndex, colIndex});
    }

    doubleClick = (row: any, col: Column) => {
        this.onDoubleClick.send({row, col});
    }

    dragStart: CellDragEvent = (e, row, col, rowIndex, colIndex) => {
        this.onDragStart.send({e, row, col, rowIndex, colIndex});
    }

    dragEnter: CellDragEvent = (e, row, col, rowIndex, colIndex) => {
        this.onDragEnter.send({e, row, col, rowIndex, colIndex});
    }

    dragEnd: CellDragEvent = (e, row, col, rowIndex, colIndex) => {
        this.onDragEnd.send({e, row, col, rowIndex, colIndex});
    }
}

class ContentEvents {
    onMouseLeave = new Subscription<undefined>();
    onKeyDown = new Subscription<React.KeyboardEvent<HTMLDivElement>>();
    onContextMenu = new Subscription<React.MouseEvent<HTMLDivElement>>();
    onBlur = new Subscription<React.FocusEvent<HTMLDivElement>>();

    mouseLeave = () => {
        this.onMouseLeave.send(undefined);
    }

    keyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        this.onKeyDown.send(e);
    }

    contextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        this.onContextMenu.send(e);
    }

    blur = (e: React.FocusEvent<HTMLDivElement>) => {
        this.onBlur.send(e);
    }
}

export class AVGridEvents {
    cell = new CellEvents();
    content = new ContentEvents();

    onColumnResize = new Subscription<{columnKey: string, width: number}>();
    onColumnsReorder = new Subscription<{sourceKey: string, targetKey: string}>();
    onColumnsChanged = new Subscription<undefined>();

    columnResize: TOnColumnResize = (columnKey: string, width: number) => {
        this.onColumnResize.send({columnKey, width});
    }

    columnsReorder: TOnColumnsReorder = (sourceKey: string, targetKey: string) => {
        this.onColumnsReorder.send({sourceKey, targetKey});
    }

    columnsChanged = () => {
        this.onColumnsChanged.send(undefined);
    }
}