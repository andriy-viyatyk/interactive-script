import { prepareRerender } from './rerender-check';
import {
    AdjustRenderRangeFunc,
    CalcRenderInfoInput,
    ElementLength,
    Percent,
    RanderedRange,
    RenderCellKey,
    RenderData,
    RenderInnerSize,
    RenderInputPrepared,
    RenderLength,
    RenderPoint,
    RenderRect,
    RenderSize,
    RerenderInfoPrepared,
    RowAlign,
} from './types';

export const renderInfoInitialState: RenderInputPrepared = {
    visible: { top: 0, right: 0, bottom: 0, left: 0 },
    rendered: { top: 0, right: 0, bottom: 0, left: 0 },
    visibleOffset: { top: 0, right: 0, bottom: 0, left: 0 },
    innerSize: {
        width: 0,
        height: 0,
        stickyTopHeight: 0,
        stickyRightWidth: 0,
        stickyBottomHeight: 0,
        stickyLeftWidth: 0,
    },
    columnLength: [],
    rowLength: [],
    columnStarts: [],
    rowStarts: [],
    input: {
        size: { width: 0, height: 0 },
        rowCount: 0,
        columnCount: 0,
        stickyTop: 0,
        stickyRight: 0,
        stickyBottom: 0,
        stickyLeft: 0,
        scrollBarWidth: 0,
        scrollBarHeight: 0,
        fitToWidth: false,
    },

    cells: [],
    stickyTop: [],
    stickyLeft: [],
    stickyRight: [],
    stickyBottom: [],
    stickyTopLeft: [],
    stickyTopRight: [],
    stickyBottomRight: [],
    stickyBottomLeft: [],
    map: {},
    renderRange: {
       rows: [],
       columns: [],
    },
};

export const whiteSpace = 20;

function fromPercent(val: Percent) {
    return Number(val.substring(0, val.length - 1));
}

function doFitToLength(arr: Array<number | Percent>, length: number) {
    const fixedWidth = arr.reduce((acc: number, item) => {
        return acc + (typeof item === 'number' ? item : 0);
    }, 0);
    const totalPercent = arr.reduce((acc: number, item) => {
        return acc + (typeof item === 'string' ? fromPercent(item) : 0);
    }, 0);
    const lastPercentIndex = arr.reduce((acc, item, idx) => {
        return typeof item === 'string' ? idx : acc;
    }, -1);
    let divideWidth = Math.max(0, length - fixedWidth);
    const widthPerPercent = totalPercent > 0 ? divideWidth / totalPercent : 0;

    return arr.map((item, idx) => {
        if (typeof item === 'string') {
            if (idx === lastPercentIndex) {
                return divideWidth;
            }
            const width = Math.trunc(fromPercent(item) * widthPerPercent);
            divideWidth = Math.max(0, divideWidth - width);
            return width;
        }
        return item;
    });
}

export function buildLengthArray(
    elementCount: number,
    elementLength: ElementLength,
    fitToLength: boolean = false,
    length: number = 0,
): RenderLength {
    if (typeof elementLength === 'number') {
        return elementLength;
    }
    const res = Array.from({ length: elementCount }, (_v, i) =>
        elementLength(i),
    );

    if (
        Array.isArray(res) &&
        (fitToLength || res.some((i) => typeof i === 'string'))
    ) {
        return doFitToLength(res, length);
    }

    return res as Array<number>;
}

export function buildStarts(length: RenderLength) {
    if (typeof length === 'number') {
        return length;
    }

    const starts = [...length];
    starts.forEach((_, i) => {
        starts[i] = i === 0 ? 0 : starts[i - 1] + length[i - 1];
    });

    return starts;
}

function calcLength(length: RenderLength, from: number, count: number = 1) {
    if (typeof length === 'number') {
        return count * length;
    }

    let res = 0;
    for (let i = from; i < from + count; i++) {
        res += length[i];
    }
    return res;
}

function getLength(length: RenderLength, elementIndex: number) {
    return typeof length === 'number' ? length : length[elementIndex];
}

function getStarts(starts: RenderLength, elementIndex: number) {
    if (typeof starts === 'number') {
        return elementIndex * starts;
    }
    return starts[elementIndex];
}

function elementAt(
    length: RenderLength,
    x: number,
    lastByDefault: boolean = true,
) {
    if (typeof length === 'number') {
        return Math.trunc(x / length);
    }

    let res = lastByDefault ? length.length - 1 : -1;
    let sum = 0;
    for (let i = 0; i < length.length; i++) {
        sum += length[i];
        if (sum > x) {
            res = i;
            break;
        }
    }
    return res;
}

const RenderInfoProto = {
    calcExpandWidth(this: RenderInputPrepared, col: number, colCount: number) {
        return calcLength(this.columnLength, col, colCount);
    },

    calcExpandHeight(this: RenderInputPrepared, row: number, rowCount: number) {
        return calcLength(this.rowLength, row, rowCount);
    },
};

export const calcInnerSize = (
    rowCount: number,
    columnCount: number,
    stickyTop: number,
    stickyRight: number,
    stickyBottom: number,
    stickyLeft: number,
    columnLength: RenderLength,
    rowLength: RenderLength,
    fitToWidth: boolean,
    whiteSpaceY?: number,
) => ({
    width:
        calcLength(columnLength, 0, columnCount) +
        (stickyRight || fitToWidth ? 0 : whiteSpace),
    height:
        calcLength(rowLength, 0, rowCount) +
        (stickyBottom ? 0 : (whiteSpaceY ?? whiteSpace)),
    stickyTopHeight: calcLength(rowLength, 0, stickyTop),
    stickyRightWidth: calcLength(
        columnLength,
        columnCount - stickyRight,
        stickyRight,
    ),
    stickyBottomHeight: calcLength(
        rowLength,
        rowCount - stickyBottom,
        stickyBottom,
    ),
    stickyLeftWidth: calcLength(columnLength, 0, stickyLeft),
});

export function calcCellRange(
    innerSize: RenderInnerSize,
    rowCount: number,
    columnCount: number,
    width: number,
    height: number,
    offset: RenderPoint,
    overscanColumn: number,
    overscanRow: number,
    direction: RenderPoint,
    columnLength: RenderLength,
    rowLength: RenderLength,
    scrollBarWidth: number,
    scrollBarHeight: number,
    onAdjustRenderRange?: AdjustRenderRangeFunc,
): RanderedRange {
    let left = elementAt(columnLength, offset.x + innerSize.stickyLeftWidth);
    let right = elementAt(
        columnLength,
        offset.x + width /* - innerSize.stickyRightWidth */ - scrollBarWidth,
    ); // if sticky right is transparent then need to render more columns to right
    left = Math.max(0, left);
    right = Math.min(right, columnCount - 1);

    let top = elementAt(rowLength, offset.y + innerSize.stickyTopHeight);
    let bottom = elementAt(
        rowLength,
        offset.y + height - innerSize.stickyBottomHeight - scrollBarHeight,
    );
    top = Math.max(0, top);
    bottom = Math.min(bottom, rowCount - 1);

    const rendered = {
        top: direction.y < 0 ? Math.max(0, top - overscanRow) : top,
        right:
            direction.x > 0
                ? Math.min(columnCount - 1, right + overscanColumn)
                : right,
        bottom:
            direction.y > 0
                ? Math.min(rowCount - 1, bottom + overscanRow)
                : bottom,
        left: direction.x < 0 ? Math.max(0, left - overscanColumn) : left,
    };

    if (onAdjustRenderRange) {
        onAdjustRenderRange(rendered);
    }

    return {
        visible: { top, right, bottom, left },
        rendered,
    };
}

export const calcOffsetRange = (
    cellsRange: RenderRect,
    rowLength: RenderLength,
    columnLength: RenderLength,
    rowStarts: RenderLength,
    columnStarts: RenderLength,
    size: RenderSize,
    innerSize: RenderInnerSize,
    scrollBarWidth: number,
    scrollBarHeight: number,
) => ({
    left: getStarts(columnStarts, cellsRange.left) - innerSize.stickyLeftWidth,
    right:
        calcLength(columnLength, 0, cellsRange.right + 1) -
        (size.width - innerSize.stickyRightWidth - scrollBarWidth),
    top: getStarts(rowStarts, cellsRange.top) - innerSize.stickyTopHeight,
    bottom:
        calcLength(rowLength, 0, cellsRange.bottom + 1) -
        (size.height - innerSize.stickyBottomHeight - scrollBarHeight),
});

const _renderCell = (
    renderData: RenderData,
    row: number,
    col: number,
    startRow: number = 0,
    startCol: number = 0,
) => {
    const {
        renderCell,
        old,
        newInfo,
        rerender,
        rowLength,
        columnLength,
        rowStarts,
        columnStarts,
    } = renderData;

    const key: RenderCellKey = `${row}_${col}`;
    let cell = old.map[key];
    if (
        !cell ||
        (rerender &&
            (rerender.all ||
                rerender.cells[key] ||
                rerender.columns[col] ||
                rerender.rows[row]))
    ) {
        cell =
            renderCell?.({
                col,
                row,
                style: {
                    display: 'inline-flex',
                    position: 'absolute',
                    left: startCol
                        ? calcLength(columnLength, startCol, col - startCol)
                        : getStarts(columnStarts, col),
                    width: getLength(columnLength, col),
                    top: startRow
                        ? calcLength(rowLength, startRow, row - startRow)
                        : getStarts(rowStarts, row),
                    height: getLength(rowLength, row),
                },
                key,
                renderInfo: newInfo,
            });
    }
    newInfo.map[key] = cell;
    if (newInfo.renderRange.rows.indexOf(row) < 0) {
        newInfo.renderRange.rows.push(row);
    }
    if (newInfo.renderRange.columns.indexOf(col) < 0) {
        newInfo.renderRange.columns.push(col);
    }
    return cell;
};

export function calcRenderInfo(
    old: RenderInputPrepared,
    input: CalcRenderInfoInput,
    whiteSpaceY?: number,
) {
    const {
        offset,
        size,
        rowCount,
        columnCount,
        rowHeight,
        columnWidth,
        renderCell,
        stickyTop = 0,
        stickyLeft = 0,
        stickyRight = 0,
        stickyBottom = 0,
        overscanColumn,
        overscanRow,
        scrollBarWidth,
        scrollBarHeight,
        direction = { x: 0, y: 0 },
        fitToWidth,
        onAdjustRenderRange,
    } = input;

    const { rerender } = input;

    if (!rerender && (direction.x || direction.y) && old.visibleOffset) {
        // check rendered scroll offset
        if (
            offset.x >= old.visibleOffset.left &&
            offset.x <= old.visibleOffset.right &&
            offset.y >= old.visibleOffset.top &&
            offset.y <= old.visibleOffset.bottom
        ) {
            return old;
        }
    }

    const columnLength = buildLengthArray(
        columnCount,
        columnWidth,
        fitToWidth,
        size.width - scrollBarWidth,
    );

    const rowLength = buildLengthArray(rowCount, rowHeight);

    const newInnerSize = calcInnerSize(
        rowCount,
        columnCount,
        stickyTop,
        stickyRight,
        stickyBottom,
        stickyLeft,
        columnLength,
        rowLength,
        fitToWidth,
        whiteSpaceY,
    );

    const newRange: RanderedRange = calcCellRange(
        newInnerSize,
        rowCount,
        columnCount,
        size.width,
        size.height,
        offset,
        overscanColumn,
        overscanRow,
        direction,
        columnLength,
        rowLength,
        scrollBarWidth,
        scrollBarHeight,
        onAdjustRenderRange,
    );

    let rerenderPrepared: RerenderInfoPrepared | null;

    if (old.rendered.top || old.rendered.bottom) {
        rerenderPrepared = prepareRerender(
            rerender,
            old,
            input,
            columnLength,
            rowLength,
        );
        if (
            !rerender &&
            newRange.visible.left >= old.visible.left &&
            newRange.visible.right <= old.visible.right &&
            newRange.visible.top >= old.visible.top &&
            newRange.visible.bottom <= old.visible.bottom &&
            newInnerSize.width === old.innerSize.width &&
            newInnerSize.height === old.innerSize.height &&
            newInnerSize.stickyTopHeight === old.innerSize.stickyTopHeight &&
            newInnerSize.stickyRightWidth === old.innerSize.stickyRightWidth &&
            newInnerSize.stickyBottomHeight ===
                old.innerSize.stickyBottomHeight &&
            newInnerSize.stickyLeftWidth === old.innerSize.stickyLeftWidth
        ) {
            return old;
        }
    } else {
        rerenderPrepared = { all: true, cells: {}, columns: {}, rows: {} };
    }

    const columnStarts = buildStarts(columnLength);
    const rowStarts = buildStarts(rowLength);

    newRange.visibleOffset = calcOffsetRange(
        newRange.visible,
        rowLength,
        columnLength,
        rowStarts,
        columnStarts,
        size,
        newInnerSize,
        scrollBarWidth,
        scrollBarHeight,
    );

    const newInfo: RenderInputPrepared = {
        ...newRange,
        innerSize: newInnerSize,
        columnLength,
        rowLength,
        columnStarts,
        rowStarts,
        input: {
            size,
            rowCount,
            columnCount,
            stickyTop,
            stickyRight,
            stickyBottom,
            stickyLeft,
            scrollBarWidth,
            scrollBarHeight,
            fitToWidth,
        },

        cells: [],
        stickyTop: [],
        stickyLeft: [],
        stickyRight: [],
        stickyBottom: [],
        stickyTopLeft: [],
        stickyTopRight: [],
        stickyBottomRight: [],
        stickyBottomLeft: [],
        map: {},
        renderRange: {
            rows: [],
            columns: [],
        },
    };

    Object.setPrototypeOf(newInfo, RenderInfoProto);

    const rd: RenderData = {
        renderCell,
        old,
        newInfo,
        rerender: rerenderPrepared,
        rowLength,
        columnLength,
        rowStarts,
        columnStarts,
    };

    for (let r = newInfo.rendered.top; r <= newInfo.rendered.bottom; r++) {
        for (let c = newInfo.rendered.left; c <= newInfo.rendered.right; c++) {
            if (
                !(
                    r < stickyTop ||
                    c < stickyLeft ||
                    r >= rowCount - stickyBottom ||
                    c >= columnCount - stickyRight
                )
            ) {
                newInfo.cells.push(_renderCell(rd, r, c));
            }
        }
    }

    // sticky top
    for (let r = 0; r < stickyTop; r++) {
        for (let c = 0; c < stickyLeft; c++) {
            newInfo.stickyTopLeft.push(_renderCell(rd, r, c));
        }
        for (
            let c = Math.max(stickyLeft, newInfo.rendered.left);
            c <=
            Math.min(newInfo.rendered.right, columnCount - stickyRight - 1);
            c++
        ) {
            newInfo.stickyTop.push(_renderCell(rd, r, c));
        }
        for (let c = columnCount - stickyRight; c < columnCount; c++) {
            newInfo.stickyTopRight.push(
                _renderCell(rd, r, c, 0, columnCount - stickyRight),
            );
        }
    }

    // sticky bottom
    for (let r = rowCount - stickyBottom; r < rowCount; r++) {
        for (let c = 0; c < stickyLeft; c++) {
            newInfo.stickyBottomLeft.push(
                _renderCell(rd, r, c, rowCount - stickyBottom, 0),
            );
        }
        for (
            let c = Math.max(stickyLeft, newInfo.rendered.left);
            c <=
            Math.min(newInfo.rendered.right, columnCount - stickyRight - 1);
            c++
        ) {
            newInfo.stickyBottom.push(
                _renderCell(rd, r, c, rowCount - stickyBottom, 0),
            );
        }
        for (let c = columnCount - stickyRight; c < columnCount; c++) {
            newInfo.stickyBottomRight.push(
                _renderCell(
                    rd,
                    r,
                    c,
                    rowCount - stickyBottom,
                    columnCount - stickyRight,
                ),
            );
        }
    }

    // sticky left and right
    for (
        let r = Math.max(stickyTop, newInfo.rendered.top);
        r <= Math.min(newInfo.rendered.bottom, rowCount - stickyBottom - 1);
        r++
    ) {
        for (let c = 0; c < stickyLeft; c++) {
            newInfo.stickyLeft.push(_renderCell(rd, r, c, stickyTop, 0));
        }
        for (let c = columnCount - stickyRight; c < columnCount; c++) {
            newInfo.stickyRight.push(
                _renderCell(rd, r, c, stickyTop, columnCount - stickyRight),
            );
        }
    }

    return newInfo;
}

export function calcScrollOffsetX(
    col: number,
    renderInfo: RenderInputPrepared,
    currOffset: RenderPoint,
) {
    const cell = {
        left: getStarts(renderInfo.columnStarts, col),
        right: calcLength(renderInfo.columnLength, 0, col + 1),
    };

    const size = renderInfo.input.size;
    const res = { ...currOffset };

    const visibleWidth =
        size.width -
        renderInfo.innerSize.stickyRightWidth -
        renderInfo.input.scrollBarWidth;
    if (res.x + visibleWidth < cell.right) {
        res.x = cell.right - visibleWidth;
    } else if (res.x > cell.left - renderInfo.innerSize.stickyLeftWidth) {
        res.x = cell.left - renderInfo.innerSize.stickyLeftWidth;
    }

    return res;
}

export function calcScrollOffsetY(
    row: number,
    renderInfo: RenderInputPrepared,
    currOffset: RenderPoint,
    rowAlign: RowAlign = "nearest"
) {
    const cell = {
        top: getStarts(renderInfo.rowStarts, row),
        bottom: calcLength(renderInfo.rowLength, 0, row + 1),
    };

    const size = renderInfo.input.size;
    const res = { ...currOffset };

    const visibleHeight =
        size.height -
        renderInfo.innerSize.stickyBottomHeight -
        renderInfo.input.scrollBarHeight;

    if (rowAlign === "nearest") {
        if (res.y + visibleHeight < cell.bottom) {
            res.y = cell.bottom - visibleHeight;
        } else if (res.y > cell.top - renderInfo.innerSize.stickyTopHeight) {
            res.y = cell.top - renderInfo.innerSize.stickyTopHeight;
        }
    }
    else if (rowAlign === "top") {
        res.y = cell.top - renderInfo.innerSize.stickyTopHeight;
    }
    else if(rowAlign === "bottom") {
        res.y = cell.bottom - visibleHeight;
    }
    else if(rowAlign === "center") {
        res.y = cell.top - renderInfo.innerSize.stickyTopHeight + (cell.bottom - cell.top - visibleHeight) / 2;
    }

    return res;
}

export function calcScrollOffset(
    row: number,
    col: number,
    renderInfo: RenderInputPrepared,
    currOffset: RenderPoint,
) {
    return calcScrollOffsetY(
        row,
        renderInfo,
        calcScrollOffsetX(col, renderInfo, currOffset),
    );
}
