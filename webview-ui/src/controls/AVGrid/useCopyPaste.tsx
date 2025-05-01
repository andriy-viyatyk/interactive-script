/* eslint-disable no-restricted-syntax */
import React, { SetStateAction, useCallback } from 'react';
import { CellFocus, Column } from './avGridTypes';
import { columnDisplayValue, rowsToCsvText } from './avGridUtils';
import { toClipboard } from '../../common/utils/utils';
import { csvToRecords } from '../../common/utils/csvUtils';
import { getGridSelection } from './useUtils';

interface UseCopyPasteProps<R> {
    focus?: CellFocus<R>;
    setFocus?: (value?: SetStateAction<CellFocus | undefined>) => void;
    rows: R[];
    columns: Column<R>[];
    onAreaKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    getRowKey: (row: any) => string;
    editCell: (col: Column<R>, row: R, val: any) => void;
    onAddRows?: (count: number, insertIndex?: number) => R[];
}

export function useCopyPaste<R>({
    focus,
    setFocus,
    rows,
    columns,
    onAreaKeyDown: onAreaKeyDownProp,
    getRowKey,
    editCell,
    onAddRows,
}: UseCopyPasteProps<R>) {
    const copySelection = useCallback(() => {
        if (!focus) return;

        const selection = getGridSelection(focus, rows, columns, getRowKey);
        if (!selection) return;

        let text = '';
        if (selection.rows.length === 1 && selection.columns.length === 1) {
            text = columnDisplayValue(selection.columns[0], selection.rows[0]);
        } else {
            text =
                rowsToCsvText(selection.rows, selection.columns, false, true) ??
                '';
        }
        toClipboard(text);
    }, [columns, focus, getRowKey, rows]);

    const canPasteFromClipboard = useCallback(async () => {
        if (!focus) return false;
        const selection = getGridSelection(focus, rows, columns, getRowKey);
        if (selection && selection.rows.length && selection.columns.length) {
            const text = await navigator.clipboard.readText();
            if (text) {
                return true;
            }
        }
        return false;
    }, [columns, focus, getRowKey, rows]);

    const expandPasteRange = useCallback(
        (rowCount: number, colCount: number) => {
            let pasteColumns: Column<R>[] = [];
            let pasteRows: R[] = [];
            if (!focus) return { pasteColumns, pasteRows };

            const startRowIndex = rows.findIndex(r => getRowKey(r) === focus.rowKey);
            const startColIndex = columns.findIndex(c => c.key === focus.columnKey);
            if (startRowIndex < 0 || startColIndex < 0) return { pasteColumns, pasteRows };

            let endRowIndex = startRowIndex + rowCount - 1;
            let newRows: R[] = [];
            if (endRowIndex >= rows.length) {
                newRows = onAddRows?.(endRowIndex - rows.length + 1) ?? [];
                endRowIndex = rows.length - 1 + newRows.length;
            }

            const endColIndex = Math.min(startColIndex + colCount - 1, columns.length - 1);

            pasteColumns = columns.slice(startColIndex, endColIndex + 1);
            pasteRows = rows.slice(startRowIndex, endRowIndex + 1).concat(newRows);

            if (pasteColumns.length && pasteRows.length && setFocus) {
                setFocus({
                    columnKey: pasteColumns[0].key,
                    rowKey: getRowKey(pasteRows[0]),
                    isDragging: false,
                    selection: {
                        colKeyStart: pasteColumns[pasteColumns.length - 1].key,
                        rowKeyStart: getRowKey(pasteRows[pasteRows.length - 1]),
                        colKeyEnd: pasteColumns[0].key,
                        rowKeyEnd: getRowKey(pasteRows[0]),
                        colStart: endColIndex,
                        rowStart: startRowIndex + pasteRows.length - 1,
                        colEnd: startColIndex,
                        rowEnd: startRowIndex,
                    }
                });
            }

            return { pasteColumns, pasteRows };
        },
        [columns, focus, getRowKey, onAddRows, rows, setFocus],
    );

    const pasteFromClipboard = useCallback(async () => {
        if (!focus) return;
        const selection = getGridSelection(focus, rows, columns, getRowKey);
        if (selection && selection.rows.length && selection.columns.length) {
            const text = await navigator.clipboard.readText();
            if (text) {
                let records = csvToRecords(text);
                if (!records.length && text?.length) {
                    records = [[text]];
                }
                if (records.length && records[0].length) {
                    let pasteColumns = selection.columns;
                    let pasteRows = selection.rows;
    
                    if (pasteColumns.length === 1 && pasteRows.length === 1) {
                        ({ pasteColumns, pasteRows } = expandPasteRange(records.length, records[0].length));
                    }

                    const sourceRowCount = records.length;
                    const sourceColCount = records[0].length;
                    let sourceRow = 0;
                    let sourceCol = 0;
                    for (const row of pasteRows) {
                        sourceCol = 0;
                        for (const col of pasteColumns) {
                            if (sourceRow < sourceRowCount && sourceCol < sourceColCount) {
                                editCell(col, row, records[sourceRow][sourceCol]);
                                sourceCol++;
                                if (sourceCol === sourceColCount) {
                                    sourceCol = 0;
                                }
                            }
                        }
                        sourceRow++;
                        if (sourceRow === sourceRowCount) {
                            sourceRow = 0;
                        }
                    }
                }
            }
        }
    }, [columns, editCell, expandPasteRange, focus, getRowKey, rows]);

    const onAreaKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.ctrlKey && focus) {
                switch (e.code) {
                    case 'KeyC': {
                        copySelection();
                        break;
                    }
                    case 'KeyV': {
                        pasteFromClipboard();
                        break;
                    }
                    default:
                        break;
                }
            }
            onAreaKeyDownProp(e);
        },
        [copySelection, focus, onAreaKeyDownProp, pasteFromClipboard],
    );

    return {
        onAreaKeyDown,
        copySelection,
        canPasteFromClipboard,
        pasteFromClipboard,
    };
}
