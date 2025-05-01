import React, { RefObject, useCallback, useEffect } from 'react';
import { CellEdit, CellFocus, CellMouseEvent, Column } from './avGridTypes';
import RenderGridModel from '../RenderGrid/RenderGridModel';
import { useComponentState } from '../../common/classes/state';
import { getGridFocus, getGridSelection } from './useUtils';

interface UseEditingProps<R> {
    focus?: CellFocus<R>;
    rows: R[];
    columns: Column<R>[];
    onAreaKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    onMouseDown: CellMouseEvent;
    renderGridRef: RefObject<RenderGridModel | null>;
    getRowKey: (row: any) => string;
    editRow?: (columnKey: string, rowKey: string, value: any) => void;
}

export function useEditing<R>({
    focus,
    rows,
    columns,
    onAreaKeyDown: onAreaKeyDownProp,
    onMouseDown: onMouseDownProps,
    renderGridRef,
    getRowKey,
    editRow,
}: UseEditingProps<R>) {
    const cellEdit = useComponentState<CellEdit<R>>({
        columnKey: '',
        rowKey: '',
        value: undefined,
    });

    const editCell = useCallback((col: Column<R>, row: R, val: any) => {
        if (!col.editable) return;
        
        const value = col.validate
            ? col.validate(col, row, val)
            : val;
        editRow?.(col.key.toString(), getRowKey(row), value);
    }, [editRow, getRowKey]);

    const deleteRange = useCallback(() => {
        const gridSelection = getGridSelection(focus, rows, columns, getRowKey);
        if (gridSelection) {
            gridSelection.columns.forEach((col) => {
                if (col.editable) {
                    gridSelection.rows.forEach((row) => {
                        editCell(col, row, undefined);
                    });
                }
            });
        }
    }, [columns, editCell, focus, getRowKey, rows]);

    const closeEdit = useCallback(
        (commit: boolean) => {
            const editState = cellEdit.get();
            let rowIndex = -1;

            if (editState.rowKey && editState.columnKey) {
                rowIndex = rows.findIndex(
                    (r) => getRowKey(r) === editState.rowKey,
                );
                const row = rows[rowIndex];
                const column = columns.find(
                    (c) => c.key === editState.columnKey,
                );
                if (commit && column && row) {
                    editCell(column, row, editState.value);
                }
            }
            cellEdit.set({ columnKey: '', rowKey: '', value: undefined });

            if (rowIndex >= 0) {
                renderGridRef.current?.update({ rows: [rowIndex + 1] });
                renderGridRef.current?.gridRef.current?.focus();
            }
        },
        [cellEdit, columns, editCell, getRowKey, renderGridRef, rows],
    );

    const openEdit = useCallback(
        (
            columnKey: keyof R | string,
            rowKey: string,
            value: any,
            dontSelect: boolean,
        ) => {
            const cellState = cellEdit.get();
            const cellValue =
                cellState.columnKey === columnKey && cellState.rowKey === rowKey
                    ? (cellState.value)
                    : '';
            cellEdit.set({
                columnKey,
                rowKey,
                value: `${cellValue ?? ''}${value ?? ''}`,
                dontSelect,
            });
        },
        [cellEdit],
    );

    useEffect(() => {
        const editState = cellEdit.get();
        if (
            focus &&
            editState.columnKey &&
            (focus.columnKey !== editState.columnKey ||
                focus.rowKey !== editState.rowKey)
        ) {
            closeEdit(true);
        }
    }, [cellEdit, closeEdit, focus]);

    const getEditItems = useCallback(() => {
        const gridFocus = editRow ? getGridFocus(focus, rows, columns, getRowKey) : undefined;

        if (gridFocus && gridFocus.rowIndex >= 0) {
            renderGridRef.current?.update({ rows: [gridFocus.rowIndex + 1] });
        }

        return gridFocus && gridFocus.column.editable && gridFocus.row
            ? { column: gridFocus.column, row: gridFocus.row, rowIndex: gridFocus.rowIndex }
            : { column: undefined, row: undefined, rowIndex: -1 };
    }, [editRow, focus, columns, rows, getRowKey, renderGridRef]);

    const onAreaKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            let keyHandled = false;
            if (
                ['Enter', 'F2', 'Delete', 'Escape', 'ArrowLeft', 'ArrowRight'].includes(
                    e.key,
                ) &&
                focus
            ) {
                const { column, row } = getEditItems();
                if (row && column) {
                    const editState = cellEdit.get();
                    switch (e.key) {
                        case 'Enter':
                        case 'F2':
                            if (
                                editState.columnKey === focus.columnKey &&
                                editState.rowKey === focus.rowKey
                            ) {
                                closeEdit(true);
                            } else {
                                openEdit(
                                    focus.columnKey,
                                    focus.rowKey,
                                    row[column.key as keyof R],
                                    false,
                                );
                            }
                            break;
                        case 'Delete':
                            deleteRange();
                            break;
                        case 'Escape':
                            closeEdit(false);
                            break;
                        case 'ArrowLeft':
                        case 'ArrowRight':
                            keyHandled = Boolean(editState.columnKey);
                            break;
                        default:
                            break;
                    }
                }
            }

            if (
                e.key.length === 1 &&
                !e.ctrlKey &&
                !e.altKey &&
                !e.metaKey &&
                focus
            ) {
                const { column } = getEditItems();
                if (column) {
                    openEdit(focus.columnKey, focus.rowKey, '', true); // e.key
                }
            }

            if (!keyHandled) {
                onAreaKeyDownProp?.(e);
            }
        },
        [cellEdit, closeEdit, deleteRange, focus, getEditItems, onAreaKeyDownProp, openEdit],
    );

    const onMouseDown = useCallback<CellMouseEvent>(
        (e, row, col, rowIndex, colIndex) => {
            if (
                e.button === 0 &&
                focus &&
                focus.columnKey === col.key &&
                focus.rowKey === getRowKey(row)
            ) {
                const editState = cellEdit.get();
                if (
                    editState.columnKey !== focus.columnKey &&
                    editState.rowKey !== focus.rowKey
                ) {
                    const { column } = getEditItems();
                    if (column) {
                        e.stopPropagation();
                        e.preventDefault();
                        openEdit(
                            focus.columnKey,
                            focus.rowKey,
                            row[col.key],
                            true,
                        );
                    }
                }
            }
            onMouseDownProps(e, row, col, rowIndex, colIndex);
        },
        [cellEdit, focus, getEditItems, getRowKey, onMouseDownProps, openEdit],
    );

    return {
        onAreaKeyDown,
        cellEdit,
        onMouseDown,
        editCell,
    };
}
