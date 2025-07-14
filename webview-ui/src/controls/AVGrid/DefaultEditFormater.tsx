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

export function DefaultEditFormater({ model }: TCellRendererProps) {
    const editRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        editRef.current?.focus();
        if (!model.state.get().cellEdit.dontSelect) {
            editRef.current?.select();
        }
    }, [model]);

    const { value, columnKey } = model.state.use(s => s.cellEdit);

    return columnKey ? (
        <EditCellTextRoot
            ref={editRef}
            value={value ?? ''}
            onChange={(v) =>
                model.state.update((s) => {
                    s.cellEdit.value = v;
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
