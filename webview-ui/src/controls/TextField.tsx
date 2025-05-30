import styled from '@emotion/styled';
import React, { forwardRef, ReactNode } from 'react';

import { FieldProps } from './types';
import { Input, InputProps } from './Input';
import color from '../theme/color';

const TextFieldRoot = styled(Input)({
    '& .textField-label': {
        color: color.text.light,
        position: 'absolute',
        left: 0,
        top: -20,
    },
});

export interface TextFieldProps extends FieldProps<string>, Omit<InputProps, 'value' | 'onChange'> {
    width?: number | string;
    endButtons?: ReactNode[];
    endButtonsWidth?: number;
    label?: string;
    placeholder?: string;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    password?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    disabled?: boolean;
}

const buttonWidth = 16;
const buttonSpacing = 4;

export const TextField = forwardRef(function TextFieldComponent(props: Readonly<TextFieldProps>, ref: React.Ref<HTMLInputElement>) {
    const {
        value,
        onChange,
        className,
        width,
        endButtons,
        label,
        placeholder,
        onKeyDown,
        password,
        onClick,
        disabled,
        ...other
    } = props;

    const addornmentEndWidth = endButtons?.length
        ? endButtons.length * (buttonWidth + buttonSpacing) + 1
        : undefined;

    return (
        <TextFieldRoot
            ref={ref}
            type={password ? "password" : "text"}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={className}
            width={width}
            addornmentEnd={endButtons}
            addornmentEndWidth={addornmentEndWidth}
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            onClick={onClick}
            disabled={disabled}
            {...other}
        >
            {Boolean(label) && <div className="textField-label">{label}</div>}
        </TextFieldRoot>
    );
});
