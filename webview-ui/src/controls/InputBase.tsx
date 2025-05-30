import React, { forwardRef, InputHTMLAttributes } from "react";
import styled from "@emotion/styled";

import color from "../theme/color";
import clsx from "clsx";

const InputBaseRoot = styled.input(
    (props) => ({
        padding: "4px 6px",
        backgroundColor: color.background.default,
        color: color.text.dark,
        border: "1px solid",
        borderColor: color.border.default,
        borderRadius: 4,
        outline: "none",
        boxSizing: "border-box",
        height: 32,
        width: props.width,
        "&:focus": {
            borderColor: color.border.active,
            outline: "none",
        },
        "&.disabled": {
            color: color.text.light,
        },
    }),
    { label: "InputBaseRoot" }
);

export const InputBase = forwardRef(function InputBaseComponent(
    props: Readonly<InputHTMLAttributes<HTMLInputElement>>,
    ref: React.Ref<HTMLInputElement>
) {
    const { disabled, ...otherProps } = props;

    return (
        <InputBaseRoot
            className={clsx("input-base", { disabled }, props.className)}
            {...otherProps}
            disabled={disabled}
            spellCheck={false}
            ref={ref}
        />
    );
});
