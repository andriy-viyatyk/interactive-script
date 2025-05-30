import styled from "@emotion/styled";
import { TextField, TextFieldProps } from "./TextField";
import {
    ForwardedRef,
    forwardRef,
    ReactElement,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { Button } from "./Button";
import { ChevronDownIcon, ChevronUpIcon, CloseIcon } from "../theme/icons";
import { Popper } from "./Popper";
import clsx from "clsx";
import color from "../theme/color";

const PopperRoot = styled(Popper)({
    display: "flex",
    flexDirection: "column",
}, { label: "ComboTemplatePopper" });

const TextFieldRoot = styled(TextField)({
    "& .clear-button": {
        display: "none",
    },
    "& .clear-button-visible": {
        display: "flex",
    },
    "& input": {
        paddingTop: 0,
        paddingBottom: 0,
        height: 26,
    },
    "&.active input": {
        borderColor: color.border.active,
    }
});

export interface ComboTemplateProps
    extends Omit<TextFieldProps, "value" | "onChange" | "onResize"> {
    open?: boolean;
    setOpen?: (value: boolean) => void;
    renderControl: () => ReactElement;
    handleKeyDown?: (event: React.KeyboardEvent) => boolean;
    inputText?: string;
    setInputText?: (value: string) => void;
    onClear?: () => boolean;
    resizable?: boolean;
    onResize?: (width: number, height: number) => void;
    active?: boolean;
}

export interface ComboTemplateRef {
    setOpen: (value: boolean) => void;
    preventBlur: () => void;
    width?: number;
    input?: HTMLInputElement | null;
}

export const ComboTemplate = forwardRef(function ComboTemplateComponent(
    props: ComboTemplateProps,
    ref: ForwardedRef<ComboTemplateRef>
) {
    const {
        open: propsOpen,
        setOpen: propsSetOpen,
        renderControl,
        disabled,
        handleKeyDown: propsHandleKeyDown,
        inputText,
        setInputText,
        onClear,
        resizable,
        onResize,
        className,
        active,
        ...other
    } = props;

    const [open, setOpen] = useState(false);
    const liveRef = useRef(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const poperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const clearRef = useRef(null);
    const preventBlurTime = useRef<Date>(null);

    const doSetOpen = propsSetOpen ?? setOpen;
    const isOpen = propsOpen || open;

    useEffect(() => {
        liveRef.current = true;
        return () => {
            liveRef.current = false;
        };
    }, []);

    const preventBlur = useCallback(
        () => (preventBlurTime.current = new Date()),
        []
    );

    useImperativeHandle(ref, () => ({
        setOpen: doSetOpen,
        preventBlur: preventBlur,
        width: (anchorEl && anchorEl.clientWidth) ?? undefined,
        input: inputRef.current,
    }));

    const handleOpen = useCallback(
        () => !isOpen && !disabled && doSetOpen(true),
        [disabled, doSetOpen, isOpen]
    );

    const handleClose = useCallback(
        () => isOpen && doSetOpen(false),
        [doSetOpen, isOpen]
    );

    const toggleOpen = useCallback(
        () => (isOpen ? handleClose() : handleOpen()),
        [handleClose, handleOpen, isOpen]
    );

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            if (propsHandleKeyDown?.(event)) {
                return;
            }

            switch (event.key) {
                case "Escape":
                    if (isOpen) {
                        event.preventDefault();
                        event.stopPropagation();
                        handleClose();
                    }
                    break;
                case "PageUp":
                case "PageDown":
                case "ArrowDown":
                case "ArrowUp":
                    event.preventDefault();
                    handleOpen();
                    break;
            }

            props.onKeyDown?.(event);
        },
        [handleClose, handleOpen, isOpen, props, propsHandleKeyDown]
    );

    const handleBlur = useCallback(() => {
        setTimeout(() => {
            if (!liveRef.current) {
                return;
            }

            if (poperRef.current?.matches(":focus-within")) {
                inputRef.current?.focus();
                return;
            }
            if (preventBlurTime.current) {
                const priventTime = new Date(preventBlurTime.current);
                priventTime.setMilliseconds(
                    priventTime.getMilliseconds() + 200
                );
                if (priventTime > new Date()) {
                    inputRef.current?.focus();
                    return;
                }
            }
            handleClose();
        }, 0);
    }, [handleClose]);

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            inputRef.current?.focus();
            if (!(clearRef.current && clearRef.current === e.target)) {
                handleOpen();
            }
        },
        [handleOpen]
    );

    const handleMouseDown = useCallback(
        (event: React.MouseEvent<HTMLInputElement>) => {
            if ((event.target as HTMLElement).tagName !== "INPUT") {
                event.preventDefault();
            }
        },
        []
    );

    const handleFocus = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            handleOpen();
            e.target.select();
        },
        [handleOpen]
    );

    const setInputRef = useCallback((element: HTMLInputElement | null) => {
        inputRef.current = element;
        setAnchorEl(element);
    }, []);

    const handleClear = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            onClear?.();
        },
        [onClear]
    );

    const value = inputText ?? "";

    const endIcons = [
        <Button
            size="small"
            type="icon"
            key="clear-button"
            onClick={handleClear}
            className={clsx("clear-button", { "clear-button-visible": value && !disabled })}
            disabled={disabled}
            tabIndex={-1}
        >
            <CloseIcon />
        </Button>,
        <Button
            key="open-button"
            size="small"
            type="icon"
            onClick={toggleOpen}
            disabled={disabled}
            className="combo-template-open-icon"
            tabIndex={-1}
        >
            {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Button>,
    ];

    return (
        <>
            <TextFieldRoot
                className={clsx("combo-template-input", {active: active || isOpen && !disabled}, className)}
                ref={setInputRef}
                disabled={disabled}
                onBlur={handleBlur}
                onFocus={handleFocus}
                autoComplete="off"
                spellCheck={false}
                endButtons={endIcons}
                onKeyDown={handleKeyDown}
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                value={value}
                onChange={setInputText}
                title={value}
                {...other}
            />
            <PopperRoot
                ref={poperRef}
                open={isOpen && !disabled}
                elementRef={anchorEl ?? undefined}
                placement="bottom-start"
                resizable={resizable}
                onResize={onResize}
                tabIndex={0}
            >
                {renderControl()}
            </PopperRoot>
        </>
    );
});
