import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';

import { TCellRendererProps } from './avGridTypes';
import { TextField } from '../TextField';

const EditCellTextRoot = styled(TextField)({
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    '& input': {
        height: 'unset',
        border: 'none',
        padding: '0 3px',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});

export function DefaultEditFormater({ context }: TCellRendererProps) {
    const editRef = useRef<HTMLInputElement>(null);

    const cellEdit = context.cellEdit;

    useEffect(() => {
        editRef.current?.focus();
        if (!cellEdit?.get().dontSelect) {
            editRef.current?.select();
        }
    }, [cellEdit]);

    const { value, columnKey } = cellEdit.use() ?? {};

    return columnKey ? (
        <EditCellTextRoot
            ref={editRef}
            value={value ?? ''}
            onChange={(v) =>
                cellEdit?.update((s) => {
                    s.value = v;
                })
            }
            onKeyDown={(e) => {
                if (e.key.length === 1) {
                    e.stopPropagation();
                }
            }}
        />
    ) : null;
}
