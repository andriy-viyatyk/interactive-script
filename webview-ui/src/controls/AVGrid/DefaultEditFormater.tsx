import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';

import { TCellRendererProps } from './avGridTypes';
import { TextField } from '../TextField';
import { ComboSelect } from '../ComboSelect';
import { ComboTemplateRef } from '../ComboTemplate';
import color from '../../theme/color';

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

function DefaultTextEdit({ model }: TCellRendererProps) {
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
                    s.cellEdit.changed = true;
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

const EditOptionsWrapper = styled.span({
    "& .combo-template-popper": {
        borderColor: color.border.active,
    }
});

const EditOptionsRoot = styled(ComboSelect)({
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
})

function DefaultOptionsEdit(props: TCellRendererProps) {
    const { model, col } = props;
    const { value, columnKey } = model.state.use(s => s.cellEdit);
    const comboRef = useRef<ComboTemplateRef>(null);
    const column = model.data.columns[col];

     useEffect(() => {
        comboRef.current?.input?.focus();
    }, []);

    return columnKey && column ? (
        <EditOptionsWrapper onMouseDown={e => { e.stopPropagation(); e.preventDefault(); }}>
            <EditOptionsRoot
                ref={comboRef}
                value={value}
                selectFrom={column.options}
                onChange={v => {
                    model.state.update(s => {
                        s.cellEdit.value = v;
                        s.cellEdit.changed = true;
                    });
                    model.models.editing.closeEdit(true, true);
                }}
                defaultOpen
            />
        </EditOptionsWrapper>
    ) : null;
}

export function DefaultEditFormater(props: TCellRendererProps) {
    const { model, col } = props;
    const column = model.data.columns[col];
    
    if (column?.options) {
        return <DefaultOptionsEdit {...props} />;
    }

    return <DefaultTextEdit {...props} />;
}
