import clsx from 'clsx';
import React, {
    RefObject,
    SetStateAction,
    useCallback,
    useEffect,
} from 'react';

import {
    CellMouseEvent,
    CellFocus,
    CellDragEvent,
    Column,
    TAVGridContext,
} from './avGridTypes';
import RenderGridModel from '../RenderGrid/RenderGridModel';
import { range } from '../../common/utils/utils';

interface UseFocusProps {
    rows: any[];
    columns: Column[];
    focus?: CellFocus;
    setFocus?: (value?: SetStateAction<CellFocus | undefined>) => void;
    getRowKey: (row: any) => string;
    renderGridRef: RefObject<RenderGridModel | null>;
}

type SelType = 'click' | 'shiftClick' | 'rightClick' | 'startDrag' | 'drag';

function getSelectionRange(focus?: CellFocus) {
    let res = {
        rowStart: -1,
        rowEnd: -1,
        colStart: -1,
        colEnd: -1,
    }
    if (focus && focus.selection) {
        const rowRange = [focus.selection.rowStart, focus.selection.rowEnd].sort((a, b) => a - b);
        const colRange = [focus.selection.colStart, focus.selection.colEnd].sort((a, b) => a - b);
        res = {
            rowStart: rowRange[0],
            rowEnd: rowRange[1],
            colStart: colRange[0],
            colEnd: colRange[1],
        }
    }
    return res;
}

function inSelection(col: number, row: number, focus?: CellFocus) {
    const selection = getSelectionRange(focus);
    return row >= selection.rowStart && row <= selection.rowEnd && col >= selection.colStart && col <= selection.colEnd;
}

export function useFocus({
    rows,
    columns,
    focus,
    setFocus,
    getRowKey,
    renderGridRef,
}: UseFocusProps) {
    const updateFocus = useCallback(
        (
            row: any,
            col: Column,
            rowIndex: number,
            colIndex: number,
            selType: SelType,
            withScroll?: boolean,
        ) => {
            setFocus?.((foc) => {
                if (selType === 'drag' && !foc?.isDragging) {
                    return foc;
                }

                if (selType === 'rightClick' && inSelection(colIndex, rowIndex, foc)) {
                    return foc;
                }

                let oldRow = -1;
                const rowRange =
                    renderGridRef.current?.renderInfo.current?.renderRange.rows;
                if (foc && renderGridRef.current && rowRange) {
                    // skip header (r === 0)
                    oldRow =
                        rowRange.find(
                            (r) =>
                                r > 0 && getRowKey(rows[r - 1]) === foc.rowKey,
                        ) ?? -1;
                }

                renderGridRef.current?.update({
                    rows: oldRow < 0 ? [rowIndex + 1] : [oldRow, rowIndex + 1],
                });

                if (withScroll) {
                    renderGridRef.current?.scrollTo(rowIndex + 1, colIndex);
                }

                const currentSel = {
                    rowKeyEnd: getRowKey(row),
                    colKeyEnd: col.key,
                    rowEnd: rowIndex,
                    colEnd: colIndex,
                };

                const startSel =
                    selType === 'startDrag' ||
                    selType === 'click' ||
                    selType === 'rightClick' ||
                    (selType === 'shiftClick' && !foc?.selection) ||
                    !foc?.selection
                        ? {
                              rowKeyStart: getRowKey(row),
                              colKeyStart: col.key,
                              rowStart: rowIndex,
                              colStart: colIndex,
                          }
                        : {
                              rowKeyStart: foc.selection.rowKeyStart,
                              colKeyStart: foc.selection.colKeyStart,
                              rowStart: foc.selection.rowStart,
                              colStart: foc.selection.colStart,
                          };

                const oldSel = foc?.selection;

                if (oldSel) {
                    const edges = [
                        oldSel.rowStart,
                        oldSel.rowEnd,
                        currentSel.rowEnd,
                    ];
                    const min = Math.min(...edges) + 1;
                    const max = Math.max(...edges) + 1;
                    renderGridRef.current?.update({ rows: range(min, max) });
                }

                return {
                    rowKey: currentSel.rowKeyEnd,
                    columnKey: currentSel.colKeyEnd,
                    isDragging:
                        selType === 'startDrag' || Boolean(foc?.isDragging),
                    selection: {
                        ...currentSel,
                        ...startSel,
                    },
                };
            });
        },
        [getRowKey, renderGridRef, rows, setFocus],
    );

    useEffect(() => {
        setFocus?.((oldFocus) => {
            if (oldFocus) {
                const rowIndex = rows.findIndex(
                    (r) => getRowKey(r) === oldFocus.rowKey,
                );
                const colIndex = columns.findIndex(
                    (c) => c.key === oldFocus.columnKey,
                );
                if (rowIndex < 0 || colIndex < 0) {
                    return undefined;
                }
                const oldSelection = oldFocus.selection;
                if (oldSelection) {
                    const startRowIndex = rows.findIndex(
                        (r) => getRowKey(r) === oldSelection.rowKeyStart,
                    );
                    const startColIndex = columns.findIndex(
                        (c) => c.key === oldSelection.colKeyStart,
                    );
                    if (
                        startRowIndex !== oldSelection.rowStart ||
                        startColIndex !== oldSelection.colStart ||
                        rowIndex !== oldSelection.rowEnd ||
                        colIndex !== oldSelection.colEnd
                    ) {
                        renderGridRef.current?.update({ all: true });
                        return {
                            ...oldFocus,
                            selection: {
                                ...oldSelection,
                                rowStart: rowIndex,
                                colStart: colIndex,
                                rowEnd: rowIndex,
                                colEnd: colIndex,
                            },
                        };
                    }
                }
            }
            return oldFocus;
        });
    }, [rows, columns, setFocus, getRowKey, renderGridRef]);

    const onMouseDown = useCallback<CellMouseEvent>(
        (e, row, col, rowIndex, colIndex) => {
            updateFocus(
                row,
                col,
                rowIndex,
                colIndex,
                e.shiftKey
                    ? 'shiftClick'
                    : e.button === 0
                        ? 'click'
                        : 'rightClick',
            );
        },
        [updateFocus],
    );

    const onDragStart = useCallback<CellDragEvent>(
        (e, row, col, rowIndex, colIndex) => {
            if (setFocus) {
                const img = new Image();
                img.src =
                    'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
                e.dataTransfer.setDragImage(img, 0, 0);
                e.dataTransfer.setData('text/plain', 'cell-sel');
            }
            updateFocus(row, col, rowIndex, colIndex, 'startDrag');
        },
        [setFocus, updateFocus],
    );

    const onDragEnter = useCallback<CellDragEvent>(
        (e, row, col, rowIndex, colIndex) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            updateFocus(row, col, rowIndex, colIndex, 'drag');
        },
        [updateFocus],
    );

    const onDragEnd = useCallback<CellDragEvent>(() => {
        setFocus?.((foc) => (foc ? { ...foc, isDragging: false } : undefined));
    }, [setFocus]);

    const onAreaKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (
                [
                    'ArrowDown',
                    'ArrowUp',
                    'ArrowLeft',
                    'ArrowRight',
                    'Tab',
                ].includes(e.key)
            ) {
                e.preventDefault();
                e.stopPropagation();
                let rowIndex = rows.findIndex(
                    (r) => getRowKey(r) === focus?.rowKey,
                );
                let columnIndex = columns.findIndex(
                    (c) => c.key === focus?.columnKey,
                );
                if (rowIndex >= 0 && columnIndex >= 0) {
                    switch (e.key) {
                        case 'ArrowDown':
                            if (rowIndex < rows.length - 1) {
                                rowIndex++;
                            }
                            break;
                        case 'ArrowUp':
                            if (rowIndex > 0) {
                                rowIndex--;
                            }
                            break;
                        case 'ArrowLeft':
                            if (columnIndex > 0) {
                                columnIndex--;
                            }
                            break;
                        case 'ArrowRight':
                            if (columnIndex < columns.length - 1) {
                                columnIndex++;
                            }
                            break;
                        case 'Tab': {
                            columnIndex =
                                columnIndex < columns.length - 1
                                    ? columnIndex + 1
                                    : 0;
                            rowIndex =
                                columnIndex === 0 && rowIndex < rows.length - 1
                                    ? rowIndex + 1
                                    : rowIndex;
                            break;
                        }
                        default:
                            break;
                    }
                    updateFocus(
                        rows[rowIndex],
                        columns[columnIndex],
                        rowIndex,
                        columnIndex,
                        (e.shiftKey && e.key !== 'Tab') ? 'shiftClick' : 'click',
                        true,
                    );
                }
            }
        },
        [
            columns,
            focus?.columnKey,
            focus?.rowKey,
            getRowKey,
            rows,
            updateFocus,
        ],
    );

    return { onMouseDown, onDragStart, onDragEnter, onDragEnd, onAreaKeyDown };
}

export function focusClass(col: number, row: number, context: TAVGridContext) {
    const column = context.columns[col];
    const focused =
        context.focus?.rowKey === context.getRowKey(context.rows[row]) &&
        context.focus?.columnKey === column.key;
    const selection = context.focus?.selection;
    const rRange = [selection?.rowStart ?? -1, selection?.rowEnd ?? -1].sort(
        (a, b) => a - b,
    );
    const cRange = [selection?.colStart ?? -1, selection?.colEnd ?? -1].sort(
        (a, b) => a - b,
    );

    return clsx({
        focused,
        inSelection:
            row >= rRange[0] &&
            row <= rRange[1] &&
            col >= cRange[0] &&
            col <= cRange[1],
        inSelectionTop:
            row === rRange[0] && col >= cRange[0] && col <= cRange[1],
        inSelectionBottom:
            row === rRange[1] && col >= cRange[0] && col <= cRange[1],
        inSelectionLeft:
            col === cRange[0] && row >= rRange[0] && row <= rRange[1],
        inSelectionRight:
            col === cRange[1] && row >= rRange[0] && row <= rRange[1],
    });
}
