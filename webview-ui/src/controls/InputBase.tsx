import React, { forwardRef, InputHTMLAttributes } from 'react';
import styled from '@emotion/styled';

import color from '../theme/color';

const InputBaseRoot = styled.input((props) => ({
    padding: '4px 6px',
    backgroundColor: color.background.default,
    color: color.text.dark,
    border: '1px solid',
    borderColor: color.border.default,
    borderRadius: 4,
    outline: 'none',
    boxSizing: 'border-box',
    height: 32,
    width: props.width,
    '&:active': {
        borderColor: color.border.active,
    },
    '&:focus': {
        borderColor: color.border.active,
        outline: 'none',
    },
}), { label: 'InputBaseRoot' });

export const InputBase = forwardRef(function InputBaseComponent(props: Readonly<InputHTMLAttributes<HTMLInputElement>>, ref: React.Ref<HTMLInputElement>) {
    return (
        <InputBaseRoot {...props} spellCheck={false} ref={ref}/>
    );
});
