import { CellFocus, Column } from "./avGridTypes";

export function getGridFocus<R>(
    focus: CellFocus<R> | undefined,
    rows: readonly R[],
    columns: Column<R>[],
    getRowKey: (row: any) => string,
) {
    if (focus && focus.columnKey && focus.rowKey) {
        const rowIndex = rows.findIndex(
            (r) => getRowKey(r) === focus.rowKey,
        );
        const colIndex = columns.findIndex((c) => c.key === focus.columnKey);
        return {
            row: rows[rowIndex],
            column: columns[colIndex],
            rowIndex,
            colIndex,
        }
    }
}

export function getGridSelection<R>(
    focus: CellFocus<R> | undefined,
    rows: readonly R[],
    columns: Column<R>[],
    getRowKey: (row: any) => string,
) {
    if (focus && focus.columnKey && focus.rowKey) {
        const endRowIndex = rows.findIndex(
            (r) => getRowKey(r) === focus.rowKey,
        );
        const endColIndex = columns.findIndex((c) => c.key === focus.columnKey);
        const startRowIndex = focus.selection?.rowKeyStart
            ? rows.findIndex(
                  (r) => getRowKey(r) === focus.selection?.rowKeyStart,
              )
            : endRowIndex;
        const startColIndex = focus.selection?.colKeyStart
            ? columns.findIndex((c) => c.key === focus.selection?.colKeyStart)
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
}