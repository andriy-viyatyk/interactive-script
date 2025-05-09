import { CSSProperties, ReactNode, Ref } from 'react';

export type RefType<T> = Ref<T>;

export type RenderInfoObject = { [key: number]: boolean };
export type RenderCellKey = `${number}_${number}`;
export type RenderInfoCellObject = { [key: RenderCellKey]: boolean };
export type RenderRange = { rows: number[]; columns: number[] };

export type RenderCell = { row: number; col: number };
export type RenderPoint = { x: number; y: number };
export type RenderSize = { width: number; height: number };
export type RenderSizeOptional = {
    width: number | undefined;
    height: number | undefined;
};
export type Percent = `${number}%`;
export type ElementLength = number | ((v: number) => number | Percent);
export type RenderCellMap = { [key: RenderCellKey]: ReactNode };
export type RowAlign = "top" | "center" | "bottom" | "nearest";

export type RenderRect = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
export type RenderLength = number | Array<number>;

export type AdjustRenderRangeFunc = (r: RenderRect) => void;

export interface RerenderInfoPrepared {
    all: boolean;
    rows: RenderInfoObject;
    columns: RenderInfoObject;
    cells: RenderInfoCellObject;
}

export interface RerenderInfo {
    all?: boolean;
    rows?: Array<number>;
    columns?: Array<number>;
    cells?: Array<RenderCell>;
    force?: boolean;
}

export interface RanderedRange {
    visible: RenderRect;
    rendered: RenderRect;
    visibleOffset?: RenderRect;
}

export interface RenderInnerSize {
    width: number;
    height: number;
    stickyTopHeight: number;
    stickyRightWidth: number;
    stickyBottomHeight: number;
    stickyLeftWidth: number;
}

export interface RenderInput {
    size: RenderSize;
    rowCount: number;
    columnCount: number;
    stickyTop: number;
    stickyRight: number;
    stickyBottom: number;
    stickyLeft: number;
    scrollBarWidth: number;
    scrollBarHeight: number;
    fitToWidth: boolean;
}

export interface RenderInputPrepared {
    visible: RenderRect;
    rendered: RenderRect;
    visibleOffset?: RenderRect;
    innerSize: RenderInnerSize;
    columnLength: RenderLength;
    rowLength: RenderLength;
    columnStarts: RenderLength;
    rowStarts: RenderLength;

    input: RenderInput;

    // next are unknown types:
    cells: Array<ReactNode>;
    stickyTop: Array<ReactNode>;
    stickyLeft: Array<ReactNode>;
    stickyRight: Array<ReactNode>;
    stickyBottom: Array<ReactNode>;
    stickyTopLeft: Array<ReactNode>;
    stickyTopRight: Array<ReactNode>;
    stickyBottomRight: Array<ReactNode>;
    stickyBottomLeft: Array<ReactNode>;
    map: RenderCellMap;
    renderRange: RenderRange;
}

export interface RenderCellParams {
    col: number;
    row: number;
    style: CSSProperties;
    key: string | number;
    renderInfo: RenderInputPrepared;
}

export type RenderCellFunc = (p: RenderCellParams) => ReactNode;

export interface RenderData {
    renderCell: RenderCellFunc;
    old: RenderInputPrepared;
    newInfo: RenderInputPrepared;
    rerender: RerenderInfoPrepared | null;
    rowLength: RenderLength;
    columnLength: RenderLength;
    rowStarts: RenderLength;
    columnStarts: RenderLength;
}

export interface CalcRenderInfoInput {
    offset: RenderPoint;
    size: RenderSize;
    rowCount: number;
    columnCount: number;
    rowHeight: ElementLength;
    columnWidth: ElementLength;
    renderCell: RenderCellFunc;
    stickyTop: number;
    stickyLeft: number;
    stickyRight: number;
    stickyBottom: number;
    overscanColumn: number;
    overscanRow: number;
    scrollBarWidth: number;
    scrollBarHeight: number;
    direction?: RenderPoint;
    fitToWidth: boolean;
    onAdjustRenderRange?: AdjustRenderRangeFunc;
    rerender?: RerenderInfo;
}
