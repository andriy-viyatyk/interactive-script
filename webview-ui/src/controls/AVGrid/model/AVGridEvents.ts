import { Subscription } from "../../../common/classes/events";
import { Column } from "../avGridTypes";
import { AVGridModel } from "./AVGridModel";

class CellEvents {
    readonly onClick = new Subscription<{row: any, col: Column, rowIndex: number, colIndex: number}>();
    readonly onMouseDown = new Subscription<{e: React.MouseEvent<HTMLDivElement>, row: any, col: Column, rowIndex: number, colIndex: number}>();
    readonly onDoubleClick = new Subscription<{row: any, col: Column}>();
    readonly onDragStart = new Subscription<{e: React.DragEvent<HTMLDivElement>, row: any, col: Column, rowIndex: number, colIndex: number}>();
    readonly onDragEnter = new Subscription<{e: React.DragEvent<HTMLDivElement>, row: any, col: Column, rowIndex: number, colIndex: number}>();
    readonly onDragEnd = new Subscription<{e: React.DragEvent<HTMLDivElement>, row: any, col: Column, rowIndex: number, colIndex: number}>();
}

class ContentEvents {
    readonly onMouseLeave = new Subscription<undefined>();
    readonly onKeyDown = new Subscription<React.KeyboardEvent<HTMLDivElement>>();
    readonly onContextMenu = new Subscription<React.MouseEvent<HTMLDivElement>>();
    readonly onBlur = new Subscription<React.FocusEvent<HTMLDivElement>>();
}

export class AVGridEvents<R> {
    readonly model: AVGridModel<R>;

    readonly cell = new CellEvents();
    readonly content = new ContentEvents();

    readonly onColumnResize = new Subscription<{columnKey: string, width: number}>();
    readonly onColumnsReorder = new Subscription<{sourceKey: string, targetKey: string}>();
    readonly onColumnsChanged = new Subscription<undefined>();
    readonly onRowsAdded = new Subscription<{rows: R[], insertIndex?: number}>();
    readonly onRowsDeleted = new Subscription<{rowKeys: string[]}>();

    constructor(model: AVGridModel<R>) {
        this.model = model;
    }
}