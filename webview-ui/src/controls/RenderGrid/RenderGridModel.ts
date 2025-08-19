import React, { CSSProperties, HTMLAttributes } from 'react';
import AsyncRef from './AsyncRef';
import {
    AdjustRenderRangeFunc,
    ElementLength,
    RenderCellFunc,
    RenderInnerSize,
    RenderInputPrepared,
    RenderPoint,
    RenderSizeOptional,
    RerenderInfo,
    RowAlign,
} from './types';
import {
    renderInfoInitialState,
    calcRenderInfo,
    calcScrollOffset,
    calcScrollOffsetY,
    calcScrollOffsetX,
} from './renderInfo';
import { TComponentModel } from '../../common/classes/model';

const defaultRowHeight = 24;
const defaultOverscanColumns = 0;

export interface RenderGridModelInput {
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
    fitToWidth: boolean;
    size?: RenderSizeOptional;
    offset: RenderPoint;
    scrollBarWidth: number;
    scrollBarHeight: number;
}

export interface BlockStyles {
    root: React.CSSProperties;
    container: React.CSSProperties;
    renderArea: React.CSSProperties;
    stickyTop: React.CSSProperties;
    stickyTopLeft: React.CSSProperties;
    stickyTopRight: React.CSSProperties;
    stickyBottom: React.CSSProperties;
    stickyBottomLeft: React.CSSProperties;
    stickyBottomRight: React.CSSProperties;
    stickyLeft: React.CSSProperties;
    stickyRight: React.CSSProperties;
}

export interface RenderGridProps {
    rowCount: number | (() => number);
    columnCount: number | (() => number);
    rowHeight?: ElementLength;
    columnWidth: ElementLength;
    renderCell: RenderCellFunc;
    stickyTop?: number;
    stickyLeft?: number;
    stickyRight?: number;
    stickyBottom?: number;
    overscanColumn?: number;
    overscanRow?: number;
    fitToWidth?: boolean;
    onRender?: () => void;
    className?: string;
    contentProps?: HTMLAttributes<HTMLDivElement>;
    renderAreaProps?: HTMLAttributes<HTMLDivElement>;
    blockStyles?: Partial<BlockStyles>;
    onInnerSizeChange?: (is: RenderInnerSize) => void;
    onAdjustRenderRange?: AdjustRenderRangeFunc;
    qaData?: any;
    whiteSpaceY?: number;
    extraElement?: React.ReactNode;
    growToHeight?: CSSProperties['height'];
    growToWidth?: CSSProperties['height'];
}

function prepareBlockStyles(
    blockStyles: Partial<BlockStyles> = {},
): BlockStyles {
    const {
        root = {},
        container = {},
        renderArea = {},
        stickyTop = {},
        stickyTopLeft = {},
        stickyTopRight = {},
        stickyBottom = {},
        stickyBottomLeft = {},
        stickyBottomRight = {},
        stickyLeft = {},
        stickyRight = {},
    } = blockStyles;

    return {
        root,
        container,
        renderArea,
        stickyTop,
        stickyTopLeft,
        stickyTopRight,
        stickyBottom,
        stickyBottomLeft,
        stickyBottomRight,
        stickyLeft,
        stickyRight,
    };
}

export const defaultRenderGridState = {
    renderDt: new Date(),
};

type RenderGridState = typeof defaultRenderGridState;

export default class RenderGridModel extends TComponentModel<
    RenderGridState,
    RenderGridProps
> {
    gridRef = new AsyncRef<HTMLDivElement | undefined>(undefined);
    containerRef = new AsyncRef<HTMLDivElement | undefined>(undefined);
    iFrameRef?: HTMLIFrameElement;
    offsetRef: RenderPoint = { x: 0, y: 0 };
    renderInfo = new AsyncRef<RenderInputPrepared>(renderInfoInitialState);
    size: RenderSizeOptional = { width: undefined, height: undefined };
    blockStyles?: BlockStyles;
    rerenderInfo?: RerenderInfo;
    oldInput?: RenderGridModelInput;

    mapProps = (props: RenderGridProps) => {
        const {
            rowCount = 0,
            columnCount = 0,
            renderCell,
            rowHeight = defaultRowHeight, // or function (index) => height;
            columnWidth = 120, // or function (index) => width;
            stickyTop = 0,
            stickyLeft = 0,
            stickyRight = 0,
            stickyBottom = 0,
            overscanColumn = 0,
            overscanRow = 0,
            onRender,
            className,
            contentProps,
            renderAreaProps,
            blockStyles,
            fitToWidth,
            onInnerSizeChange,
            onAdjustRenderRange,
            whiteSpaceY,
        } = props;

        this.blockStyles = prepareBlockStyles(blockStyles);

        return {
            rowCount,
            columnCount,
            renderCell,
            rowHeight,
            columnWidth,
            stickyTop,
            stickyLeft,
            stickyRight,
            stickyBottom,
            overscanColumn,
            overscanRow,
            onRender,
            className,
            contentProps,
            renderAreaProps,
            blockStyles,
            fitToWidth,
            onInnerSizeChange,
            onAdjustRenderRange,
            whiteSpaceY,
        };
    };

    setProps = () => {
        if (this.inputChangted()) {
            this.updateRenderInfo(undefined, undefined, true);
        }

        if (this.isFirstUse) {
            setTimeout(() => this.checkSize(), 200);
        }
    };

    get iframe() {
        return this.iFrameRef?.contentDocument?.defaultView;
    }

    setFrameRef = (target: HTMLIFrameElement) => {
        if (target) {
            this.iFrameRef = target;
            this.iframe?.addEventListener('resize', this.onFrameResize);
            this.onFrameResize();
        }
    };

    rerender = () => {
        this.state.update((s) => {
            s.renderDt = new Date();
        });
    };

    onFrameResize = () => {
        const newSize = {
            width:
                this.iFrameRef != null ? this.iFrameRef.offsetWidth : undefined,
            height:
                this.iFrameRef != null
                    ? this.iFrameRef.offsetHeight
                    : undefined,
        };

        if (
            this.size.width !== newSize.width ||
            this.size.height !== newSize.height ||
            this.scrollBarWidth !== this.oldInput?.scrollBarWidth
        ) {
            this.size = newSize;
            this.rerender();
        }
    };

    checkSize = () => {
        if (this.isLive) this.onFrameResize();
    };

    inputChangted() {
        const newInput: RenderGridModelInput = {
            rowCount: this.rowCount,
            columnCount: this.columnCount,
            rowHeight: this.props.rowHeight ?? defaultRowHeight,
            columnWidth: this.props.columnWidth,
            renderCell: this.props.renderCell,
            stickyTop: this.props.stickyTop ?? 0,
            stickyLeft: this.props.stickyLeft ?? 0,
            stickyRight: this.props.stickyRight ?? 0,
            stickyBottom: this.props.stickyBottom ?? 0,
            overscanColumn: this.props.overscanColumn ?? defaultOverscanColumns,
            overscanRow: this.props.overscanRow ?? 0,
            fitToWidth: this.props.fitToWidth ?? false,
            size: this.size,
            offset: this.offsetRef,
            scrollBarWidth: this.scrollBarWidth,
            scrollBarHeight: this.scrollBarHeight,
        };
        const oldInput: Partial<RenderGridModelInput> = this.oldInput || {};
        this.oldInput = newInput;

        return (
            newInput.rowCount !== oldInput.rowCount ||
            newInput.columnCount !== oldInput.columnCount ||
            newInput.rowHeight !== oldInput.rowHeight ||
            newInput.columnWidth !== oldInput.columnWidth ||
            newInput.renderCell !== oldInput.renderCell ||
            newInput.stickyTop !== oldInput.stickyTop ||
            newInput.stickyLeft !== oldInput.stickyLeft ||
            newInput.stickyRight !== oldInput.stickyRight ||
            newInput.stickyBottom !== oldInput.stickyBottom ||
            newInput.overscanColumn !== oldInput.overscanColumn ||
            newInput.overscanRow !== oldInput.overscanRow ||
            newInput.fitToWidth !== oldInput.fitToWidth ||
            !newInput.size ||
            !oldInput.size ||
            newInput.size.width !== oldInput.size.width ||
            newInput.size.height !== oldInput.size.height ||
            !newInput.offset ||
            !oldInput.offset ||
            newInput.offset.x !== oldInput.offset.x ||
            newInput.offset.y !== oldInput.offset.y ||
            newInput.scrollBarWidth !== oldInput.scrollBarWidth ||
            newInput.scrollBarHeight !== oldInput.scrollBarHeight
        );
    }

    get scrollBarWidth() {
        return this.containerRef.current
            ? this.containerRef.current.offsetWidth -
                  this.containerRef.current.clientWidth
            : 0;
    }

    get scrollBarHeight() {
        return this.containerRef.current
            ? this.containerRef.current.offsetHeight -
                  this.containerRef.current.clientHeight
            : 0;
    }

    get rowCount() {
        return typeof this.props.rowCount === 'function'
            ? this.props.rowCount()
            : this.props.rowCount;
    }

    get columnCount() {
        return typeof this.props.columnCount === 'function'
            ? this.props.columnCount()
            : this.props.columnCount;
    }

    async renderInfoChanged(
        inRender: boolean | undefined,
        oldInfo: RenderInputPrepared,
        newInfo: RenderInputPrepared,
    ) {
        if (!inRender) this.rerender();

        const container = await this.containerRef.async;

        if (
            this.isLive &&
            container &&
            (this.renderInfo.current.input.scrollBarWidth !==
                this.scrollBarWidth ||
                this.renderInfo.current.input.scrollBarHeight !==
                    this.scrollBarHeight)
        ) {
            this.rerender();
        }

        this.notifyChanges(oldInfo, newInfo);
    }

    notifyChanges(oldInfo: RenderInputPrepared, newInfo: RenderInputPrepared) {
        if (
            this.props.onInnerSizeChange &&
            (oldInfo.innerSize.height !== newInfo.innerSize.height ||
                oldInfo.innerSize.width !== newInfo.innerSize.width)
        ) {
            this.props.onInnerSizeChange(newInfo.innerSize);
        }
    }

    updateRenderInfo = (
        rerender?: RerenderInfo,
        direction?: RenderPoint,
        inRender?: boolean,
    ) => {
        if (
            !this.isLive ||
            this.size.width === null ||
            this.size.height === null
        )
            return;

        const {
            rowHeight = defaultRowHeight,
            columnWidth,
            renderCell,
            stickyTop,
            stickyLeft,
            stickyRight,
            stickyBottom,
            overscanColumn = defaultOverscanColumns,
            overscanRow,
            fitToWidth = false,
            onAdjustRenderRange,
        } = this.props;

        const mergedRerender = this.mergeRerenders(rerender, this.rerenderInfo);

        const newInfo = calcRenderInfo(
            this.renderInfo.current, 
            {
                rowCount: this.rowCount,
                columnCount: this.columnCount,
                rowHeight,
                columnWidth,
                renderCell,
                stickyTop: stickyTop ?? 0,
                stickyLeft: stickyLeft ?? 0,
                stickyRight: stickyRight ?? 0,
                stickyBottom: stickyBottom ?? 0,
                overscanColumn,
                overscanRow: overscanRow ?? 0,
                fitToWidth,
                size: {
                    width: this.size.width || 0,
                    height: this.size.height || 0,
                },
                offset: this.offsetRef,
                scrollBarWidth: this.scrollBarWidth,
                scrollBarHeight: this.scrollBarHeight,
                rerender: mergedRerender,
                direction,
                onAdjustRenderRange,
            },
            this.props.whiteSpaceY,
        );

        if (
            newInfo.innerSize.height < (this.size.height ?? 0) &&
            this.offsetRef.y > 0
        ) {
            this.offsetRef.y = 0;
            this.updateRenderInfo(rerender, direction, inRender);
            return;
        }

        this.rerenderInfo = undefined;

        if (newInfo !== this.renderInfo.current) {
            const oldInfo = this.renderInfo.current;
            this.renderInfo.ref(newInfo);
            this.renderInfoChanged(inRender, oldInfo, newInfo);
        }
    };

    onScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (e.target === this.containerRef.current) {
            const { scrollLeft: x, scrollTop: y } = e.target as HTMLDivElement;
            const direction = {
                x: x - this.offsetRef.x,
                y: y - this.offsetRef.y,
            };
            this.offsetRef = { x, y };
            this.updateRenderInfo(undefined, direction);
        }
    };

    mergeRerenders = (one?: RerenderInfo, two?: RerenderInfo) => {
        if (!one && !two) {
            return undefined;
        }

        const { all = false, cells = [], rows = [], columns = [] } = one || {};
        const {
            all: oldAll = false,
            cells: oldCells = [],
            rows: oldRows = [],
            columns: oldColumns = [],
        } = two || {};
        return {
            all: all || oldAll,
            cells: [...cells, ...oldCells],
            rows: [...rows, ...oldRows],
            columns: [...columns, ...oldColumns],
        };
    };

    updateCalled = false;

    update = (rerender?: RerenderInfo) => {
        this.rerenderInfo = this.mergeRerenders(rerender, this.rerenderInfo);

        if (rerender && rerender.force) {
            this.updateRenderInfo();
        } else if (!this.updateCalled) {
            this.updateCalled = true;
            Promise.resolve().then(() => {
                this.updateCalled = false;
                if (this.isLive && this.rerenderInfo) {
                    this.updateRenderInfo();
                }
            });
        }
    };

    get visibleRowCount() {
        const visible = this.renderInfo.current.visible;
        return visible
            ? visible.bottom - visible.top + 1
            : 0;
    }

    async scrollTo(row: number, col: number) {
        const container = await this.containerRef.async;
        const info = await this.renderInfo.async;

        const newOffset = calcScrollOffset(row, col, info, this.offsetRef);
        if (container) {
            container.scrollLeft = newOffset.x;
            container.scrollTop = newOffset.y;
        }
    }

    async scrollToRow(row: number, rowAlign: RowAlign = "nearest") {
        const container = await this.containerRef.async;
        const info = await this.renderInfo.async;

        const newOffset = calcScrollOffsetY(row, info, this.offsetRef, rowAlign);
        if (container) {
            container.scrollTop = newOffset.y;
        }
    }

    async scrollToCol(col: number) {
        const container = await this.containerRef.async;
        const info = await this.renderInfo.async;

        const newOffset = calcScrollOffsetX(col, info, this.offsetRef);
        if (container) {
            container.scrollLeft = newOffset.x;
        }
    }

    async scrollBy({ x = 0, y = 0 }: { x?: number; y?: number }) {
        const container = await this.containerRef.async;
        const info = await this.renderInfo.async;

        const maxOffsetX =
            info.innerSize.width -
            info.input.size.width +
            info.input.scrollBarWidth;
        const maxOffsetY =
            info.innerSize.height -
            info.input.size.height +
            info.input.scrollBarHeight;
        if (x !== 0 && container) {
            container.scrollLeft = Math.min(
                maxOffsetX,
                container.scrollLeft + x,
            );
        }
        if (y !== 0 && container) {
            container.scrollTop = Math.min(maxOffsetY, container.scrollTop + y);
        }
    }
}
