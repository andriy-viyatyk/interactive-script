import styled from "@emotion/styled";
import color from "../theme/color";
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import {
    defaultOptionGetLabel,
    useFilteredOptions,
    useSelectOptions,
} from "./utils";
import { List, listItemHeight, ListRef } from "./List";
import { ComboTemplate, ComboTemplateProps, ComboTemplateRef } from "./ComboTemplate";
import clsx from "clsx";

const ListRoot = styled.div<{
    width?: number | string;
    height?: number | string;
}>((props) => ({
    width: props.width,
    height: props.height,
    minHeight: 18,
    display: "flex",
    flexDirection: "column",
    padding: "0, 4px",
    "& .list-empty-message": {
        color: color.text.light,
        textAlign: "center",
    },
    "&.resized": {
        flex: '1 1 auto',
    }
}));

function hoverNextInex<T = any>(
    options: readonly T[],
    step: number,
    hovered?: T
): number {
    if (!options.length) return -1;
    const hoveredIndex = hovered ? options.indexOf(hovered) : -1;

    if (hoveredIndex >= 0) {
        return step > 0
            ? Math.min(options.length - 1, hoveredIndex + step)
            : Math.max(0, hoveredIndex + step);
    } else {
        return step > 0 ? 0 : options.length - 1;
    }
}

const maxVisibleItems = 10;

export interface ComboSelectProps<T = any>
    extends Omit<ComboTemplateProps, "renderControl"> {
    selectFrom?: readonly T[] | (() => T[] | Promise<T[]>);
    getLabel?: (value: T, index?: number) => string;
    getIcon?: (value: T, index?: number) => ReactElement;
    getOptionClass?: (value: T, index?: number) => string;
    value?: T;
    onChange: (value?: T) => void;
    freeText?: boolean;
    readonly?: boolean;
    active?: boolean;
}

export function ComboSelect<T = any>(props: ComboSelectProps<T>) {
    const {
        getLabel: propsGetLabel,
        getIcon,
        getOptionClass,
        value,
        onChange,
        freeText,
        readonly,
        disabled,
        selectFrom,
        ...other
    } = props;

    const [open, setOpen] = useState(false);
    const [inputText, setInputText] = useState<string>("");
    const [search, setSearch] = useState("");
    const comboTemplateRef = useRef<ComboTemplateRef | null>(null);
    const [hovered, setHovered] = useState<T | undefined>();
    const listRef = useRef<ListRef | null>(null);
    const [resized, setResized] = useState(false);

    const getLabel = useCallback(
        (option: T, index?: number) => {
            return propsGetLabel
                ? propsGetLabel(option, index)
                : defaultOptionGetLabel(option);
        },
        [propsGetLabel]
    );

    const { options, loading } = useSelectOptions(selectFrom, open);
    const filteredOptions = useFilteredOptions(options, search, getLabel);

    useEffect(() => {
        if (open && value !== undefined && filteredOptions.includes(value)) {
            setHovered(value);
        } else {
            setHovered(undefined);
        }
    }, [value, filteredOptions, open]);

    const doSetInputText = useCallback(
        (val: string) => {
            if (freeText) {
                if (onChange) {
                    onChange(val as T);
                }
                if (open) {
                    setSearch(val);
                }
            } else {
                if (open) {
                    setInputText(val);
                    setSearch(val);
                }
            }
        },
        [freeText, onChange, open]
    );

    useEffect(() => {
        if (!freeText) {
            if (!open) {
                setInputText(value ? getLabel(value) : "");
            }
        }
    }, [freeText, getLabel, open, value]);

    useEffect(() => {
        if (freeText) {
            if (value && typeof value !== "string") {
                throw Error(
                    "CtrlComboSelect: value should be 'string' when freeText = true"
                );
            }
            setInputText(value as string);
        }
    }, [freeText, value]);

    const doSetOpen = useCallback(
        (val: boolean, clearInput: boolean = true) => {
            setOpen(val);
            setResized(false);
            if (!freeText) {
                if (!val) {
                    if (clearInput) {
                        setInputText("");
                    }
                    setSearch("");
                }
            } else {
                setSearch("");
            }
        },
        [freeText]
    );

    const onClear = useCallback(() => {
        if (!disabled) {
            onChange?.(undefined);
            doSetOpen(false);
        }
        return true;
    }, [disabled, doSetOpen, onChange]);

    const onItemClick = useCallback(
        (item: T) => {
            if (!readonly && onChange) {
                if (freeText) {
                    doSetInputText(getLabel(item));
                } else {
                    onChange(item);
                }
            }
            doSetOpen(false, false);
        },
        [doSetInputText, doSetOpen, freeText, getLabel, onChange, readonly]
    );

    const getSelected = useCallback((o: T) => value === o, [value]);
    const getHovered = useCallback(
        (o: T) => hovered !== undefined && hovered === o,
        [hovered]
    );

    const onMouseHover = useCallback((o: T) => setHovered(o), []);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            switch (e.key) {
                case "ArrowDown":
                case "PageDown":
                    if (open) {
                        e.stopPropagation();
                        e.preventDefault();

                        const nextIndex = hoverNextInex(
                            filteredOptions,
                            e.key === "PageDown" ? 9 : 1,
                            hovered
                        );
                        setHovered(
                            nextIndex < 0
                                ? undefined
                                : filteredOptions[nextIndex]
                        );
                        if (nextIndex >= 0) {
                            listRef.current?.grid?.scrollToRow(nextIndex);
                        }
                    }
                    return open;
                case "ArrowUp":
                case "PageUp":
                    if (open) {
                        e.stopPropagation();
                        e.preventDefault();
                        const nextIndex = hoverNextInex(
                            filteredOptions,
                            e.key === "PageUp" ? -9 : -1,
                            hovered
                        );
                        setHovered(
                            nextIndex < 0
                                ? undefined
                                : filteredOptions[nextIndex]
                        );
                        if (nextIndex >= 0) {
                            listRef.current?.grid?.scrollToRow(nextIndex);
                        }
                    }
                    return open;
                case "Enter":
                    if (open && hovered !== value && !hovered) {
                        e.stopPropagation();
                        e.preventDefault();
                        onChange(hovered);
                        setOpen(false);
                    }
                    return open;
            }
            return false;
        },
        [filteredOptions, hovered, onChange, open, value]
    );

    useEffect(() => {
        if (value !== undefined && open) {
            setTimeout(() => {
                const valueIndex = filteredOptions.indexOf(value);
                if (valueIndex >= 0) {
                    listRef.current?.grid?.scrollToRow(valueIndex);
                }
            }, 0);
        }
    }, [value, open, filteredOptions]);

    const handleResize = useCallback(() => {
        setResized(true);
    }, []);

    const renderDropDown = useCallback(() => {
        const height = Math.min(filteredOptions.length, maxVisibleItems) * listItemHeight;
        const width = resized ? 'unset' : comboTemplateRef.current?.input?.clientWidth ?? 200;
        return (
            <ListRoot className={clsx("list-container", { resized })} width={width} height={height}>
                <List
                    ref={listRef}
                    options={filteredOptions}
                    loading={loading}
                    onClick={onItemClick}
                    getSelected={getSelected}
                    getHovered={getHovered}
                    getLabel={propsGetLabel}
                    getIcon={getIcon}
                    getOptionClass={getOptionClass}
                    emptyMessage="no results"
                    onMouseHover={onMouseHover}
                    whiteSpaceY={0}
                />
            </ListRoot>
        );
    }, [
        resized,
        filteredOptions,
        loading,
        onItemClick,
        getSelected,
        getHovered,
        propsGetLabel,
        getIcon,
        getOptionClass,
        onMouseHover,
    ]);

    return (
        <ComboTemplate
            ref={comboTemplateRef}
            renderControl={renderDropDown}
            inputText={inputText}
            setInputText={doSetInputText}
            open={open}
            setOpen={doSetOpen}
            disabled={disabled}
            onClear={onClear}
            handleKeyDown={handleKeyDown}
            resizable
            onResize={handleResize}
            {...other}
        />
    );
}
