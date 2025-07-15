import { Subscription } from "../../../common/classes/events";
import { CellClickEvent, CellDragEvent, CellMouseEvent, Column, TOnColumnResize, TOnColumnsReorder } from "../avGridTypes";
import { AVGridModel } from "./AVGridModel";

class CellEvents {
    readonly onClick = new Subscription<{row: any, col: Column, rowIndex: number, colIndex: number}>();
    readonly onMouseDown = new Subscription<{e: React.MouseEvent<HTMLDivElement>, row: any, col: Column, rowIndex: number, colIndex: number}>();
    readonly onDoubleClick = new Subscription<{row: any, col: Column}>();
    readonly onDragStart = new Subscription<{e: React.DragEvent<HTMLDivElement>, row: any, col: Column, rowIndex: number, colIndex: number}>();
    readonly onDragEnter = new Subscription<{e: React.DragEvent<HTMLDivElement>, row: any, col: Column, rowIndex: number, colIndex: number}>();
    readonly onDragEnd = new Subscription<{e: React.DragEvent<HTMLDivElement>, row: any, col: Column, rowIndex: number, colIndex: number}>();

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
    readonly onMouseLeave = new Subscription<undefined>();
    readonly onKeyDown = new Subscription<React.KeyboardEvent<HTMLDivElement>>();
    readonly onContextMenu = new Subscription<React.MouseEvent<HTMLDivElement>>();
    readonly onBlur = new Subscription<React.FocusEvent<HTMLDivElement>>();

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

export class ToProperties<R> {
    private readonly events: AVGridEvents<R>;

    constructor(events: AVGridEvents<R>) {
        this.events = events;
        this.events.cell.onClick.subscribe(this.onClick);
        this.events.cell.onDoubleClick.subscribe(this.onDoubleClick);
    }

    private onClick = (data?: {row: any, col: Column, rowIndex: number, colIndex: number}) => {
        if (!data) return;
        this.events.model.props.onClick?.(data.row, data.col);
    }

    private onDoubleClick = (data?: {row: any, col: Column}) => {
        if (!data) return;
        this.events.model.props.onDoubleClick?.(data.row, data.col);
    }
}

export class AVGridEvents<R> {
    readonly model: AVGridModel<R>;

    readonly cell = new CellEvents();
    readonly content = new ContentEvents();

    readonly onColumnResize = new Subscription<{columnKey: string, width: number}>();
    readonly onColumnsReorder = new Subscription<{sourceKey: string, targetKey: string}>();
    readonly onColumnsChanged = new Subscription<undefined>();

    constructor(model: AVGridModel<R>) {
        this.model = model;
        new ToProperties<R>(this);
    }

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