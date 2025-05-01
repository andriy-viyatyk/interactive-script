import React, { useCallback } from 'react';
import { CellFocus, Column } from './avGridTypes';
import { showPopupMenu } from '../../dialogs/showPopupMenu';
import { CopyIcon, DeleteIcon, PasteIcon, PlusIcon } from '../../theme/icons';
import { getGridSelection } from './useUtils';

interface UseContextMenuProps<R> {
    focus?: CellFocus<R>;
    rows: R[];
    columns: Column<R>[];
    getRowKey: (row: any) => string;
    copySelection: () => void;
    onAddRows?: (count: number, insertIndex?: number) => R[];
    onDeleteRows?: (rowKeys: string[]) => void;
    canPasteFromClipboard: () => Promise<boolean>;
    pasteFromClipboard: () => void;
}

export function useContextMenu<R>({
    focus,
    rows,
    columns,
    getRowKey,
    copySelection,
    onAddRows,
    onDeleteRows,
    canPasteFromClipboard,
    pasteFromClipboard,
}: UseContextMenuProps<R>) {
    const onAreaContextMenu = useCallback(
        async (e: React.MouseEvent<HTMLDivElement>) => {
            if (focus && (e.target as HTMLElement).tagName !== 'INPUT') {
                e.stopPropagation();
                e.preventDefault();
                const selection = getGridSelection(focus, rows, columns, getRowKey);
                const canPaste = false; // await canPasteFromClipboard();
                showPopupMenu(e.clientX, e.clientY, [
                    {
                        label: 'Copy',
                        onClick: () => copySelection(),
                        icon: <CopyIcon />,
                    },
                    {
                        label: 'Paste',
                        onClick: () => pasteFromClipboard(),
                        invisible: !canPaste,
                        icon: <PasteIcon />,
                    },
                    {
                        label: `Insert ${selection?.rows.length} row${(selection?.rows.length ?? 0) > 1 ? 's' : ''}`,
                        onClick: () => onAddRows?.(selection?.rows.length ?? 1, selection?.rowRange[0]),
                        invisible: !onAddRows || !selection?.rows.length,
                        icon: <PlusIcon />,
                        startGroup: true,
                    },
                    {
                        label: `Add ${selection?.rows.length} row${(selection?.rows.length ?? 0) > 1 ? 's' : ''}`,
                        onClick: () => onAddRows?.(selection?.rows.length ?? 1),
                        invisible: !onAddRows || !selection?.rows.length,
                        icon: <PlusIcon />,
                    },
                    {
                        label: `Delete ${selection?.rows.length} row${(selection?.rows.length ?? 0) > 1 ? 's' : ''}`,
                        onClick: () =>
                            onDeleteRows?.(
                                selection?.rows.map(getRowKey) ?? [],
                            ),
                        invisible: !onDeleteRows || !selection?.rows.length,
                        icon: <DeleteIcon />,
                    },
                ]);
            }
        },
        [
            canPasteFromClipboard,
            columns,
            copySelection,
            focus,
            getRowKey,
            onAddRows,
            onDeleteRows,
            pasteFromClipboard,
            rows,
        ],
    );

    return { onAreaContextMenu };
}
