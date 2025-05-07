import React, { ComponentType, ReactNode, SetStateAction } from 'react';
import { Percent, RenderCellParams, RerenderInfo } from '../RenderGrid/types';
import { IState } from '../../common/classes/state';

export type CellClickEvent = (row: any, col: Column, rowIndex: number, colIndex: number) => void;
export type CellMouseEvent = (e: React.MouseEvent<HTMLDivElement>, row: any, col: Column, rowIndex: number, colIndex: number) => void;
export type CellDragEvent = (e: React.DragEvent<HTMLDivElement>, row: any, col: Column, rowIndex: number, colIndex: number) => void;

export interface TAVGridContext<R = any> {
    update: (rerender?: RerenderInfo) => void;
    columns: Column[];
    rows: R[];
    onColumnResize: TOnColumnResize;
    onColumnsReorder: TOnColumnsReorder;
    sortColumn?: TSortColumn;
    setSortColumn: (value: SetStateAction<TSortColumn | undefined>) => void;
    selected: ReadonlySet<string>;
    setSelected?: (value: SetStateAction<ReadonlySet<string>>) => void;
    allSelected: boolean;
    hovered: number;
    setHovered: (value: number) => void;
    getRowKey: (row: any) => string;
    disableFiltering?: boolean;
    disableSorting?: boolean;
    onClick?: CellClickEvent;
    onMouseDown?: CellMouseEvent;
    onDoubleClick?: (row: any, col: Column) => void;
    onCellClass?: (row: any, col: Column) => string;
    focus?: CellFocus;
    setFocus?: (value?: SetStateAction<CellFocus | undefined>) => void;
    onDragStart?: CellDragEvent;
    onDragEnter?: CellDragEvent;
    onDragEnd?: CellDragEvent;
    cellEdit: IState<CellEdit>
    editRow?: (columnKey: string, rowKey: string, value: any) => void;
    readonly?: boolean;
    searchString?: string;
}

export interface TCellRendererProps<R = any> extends RenderCellParams {
    context: TAVGridContext<R>;
    className?: string;
}

export type TPoint = { x: number; y: number };
export type TCellRenderer = ComponentType<TCellRendererProps>;
export type TCellFormater = (props: TCellRendererProps) => ReactNode;
export type TRowCompare<R = any> = (left: R, right: R) => number;
export type TSortDirection = 'asc' | 'desc';
export interface TSortColumn {
    key: string;
    direction: TSortDirection;
}
export type TDisplayType = 'text' | 'checkIcon';
export type TDisplayFormat =
    | 'text'
    | 'date'
    | 'dateTime'
    | 'phone'
    | `date:${string}`
    | `utcToLocal:${string}`;
export type TAlignment = 'left' | 'center' | 'right';
export type TFilterType = 'options';

export interface TFilter {
    columnKey: string;
    columnName: string;
    type: TFilterType;
    displayFormat?: TDisplayFormat;
}

export interface TAnyFilter extends TFilter {
    value: any;
}

export interface TDisplayOption<T = any> {
    value: T;
    label: string;
}

export type TOptionsFilterValue = TDisplayOption[];

export interface TOptionsFilter extends TFilter {
    type: "options";
    value?: TOptionsFilterValue;
}

export interface Column<R = any> {
    key: keyof R | string;
    name: string;
    width?: number | Percent;
    hidden?: boolean;
    haderRenderer?: TCellRenderer;
    cellRenderer?: TCellRenderer;
    cellFormater?: TCellFormater;
    editFormater?: TCellFormater;
    isStatusColumn?: boolean;
    resizible?: boolean;
    rowCompare?: TRowCompare<R>;
    displayType?: TDisplayType;
    displayFormat?: TDisplayFormat;
    dataAlignment?: TAlignment;
    filterType?: TFilterType;
    formatValue?: (column: Column<R>, row: R) => string;
    editable?: boolean;
    validate?: (column: Column<R>, row: R, value: any) => any;
}

export type TOnColumnResize = (columnKey: string, width: number) => void;
export type TOnColumnsReorder = (sourceKey: string, targetKey: string) => void;

export type CellFocus<R = any> = {
    rowKey: string;
    columnKey: keyof R | string;
    isDragging: boolean;
    selection?: {
        rowKeyStart: string;
        rowKeyEnd: string;
        colKeyStart: keyof R | string;
        colKeyEnd: keyof R | string;
        rowStart: number;
        rowEnd: number;
        colStart: number;
        colEnd: number;
    }
};

export type CellEdit<R = any> = {
    rowKey: string;
    columnKey: keyof R | string;
    value: any;
    dontSelect?: boolean;
}