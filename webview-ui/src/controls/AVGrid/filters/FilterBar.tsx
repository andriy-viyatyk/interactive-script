import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";

import { TShowFilterPoper, useFilters } from "./useFilters";
import { TFilter, TOptionsFilter } from "../avGridTypes";
import { formatDispayValue } from "../avGridUtils";
import {
    ChevronDownIcon,
    ChevronUpIcon,
    CloseIcon,
} from "../../../theme/icons";
import { Chip } from "../../Chip";
import { Button } from "../../Button";
import color from "../../../theme/color";

const ChipRoot = styled(Chip)({
    cursor: "pointer",
    border: `solid 1px ${color.border.default}`,
    borderRadius: 4,
    color: color.text.light,
    padding: "2px 0 2px 4px",
    "& .filter-chip-label": {
        display: "flex",
        alignItems: "center",
        "& .filter-chip-labels": {
            flex: "1 1 auto",
            marginLeft: 4,
            textOverflow: "ellipsis",
            overflow: "hidden",
            paddingRight: 2,
            color: color.text.default,
        },
        "& .filter-chip-open-icon": {
            display: "inline-block",
            padding: "0 4px",
            borderRight: `solid 1px ${color.border.default}`,
            width: 16,
            height: 16,
        },
        "&.disabled": {
            color: color.icon.disabled,
        },
        "& .empty-label": {
            fontStyle: "italic",
        },
    },
    "&.filter-open": {
        outline: `solid 1px ${color.border.active}`,
    },
});

const FilterBarRoot = styled.div({
    padding: "2px 4px",
    borderBottom: `solid 1px ${color.border.light}`,
    backgroundColor: color.background.dark,
    display: "flex",
    alignItems: "center",
    "&.no-filters": {
        display: "none",
    },
    "& .chips-content": {
        flex: "1 1 auto",
        display: "flex",
        rowGap: 8,
        columnGap: 8,
        flexWrap: "wrap",
    },
    "& .clear-filters-button": {
        marginRight: 4,
    },
});

const maxFilterLabelCharCount = 25;

function optionsFilterValues(filter: TOptionsFilter, maxCharCount: number) {
    if (filter.value) {
        const values = [...filter.value];
        let textRes = "";
        const res = [];
        let idx = 0;
        while (textRes.length < maxCharCount && values.length) {
            let el = formatDispayValue(
                values.shift()?.label,
                filter.displayFormat
            );

            if (textRes.length + el.length > maxCharCount) {
                el = el.substring(0, maxCharCount - textRes.length);
            }

            res.push(
                <React.Fragment key={++idx}>
                    {textRes ? "," : ""}
                    {el}
                </React.Fragment>
            );
            textRes += `${textRes ? "," : ""}${el}`;
        }

        res.push(
            <React.Fragment key={++idx}>
                {values.length ? ` (+${values.length})` : ""}
            </React.Fragment>
        );
        return res;
    }
    return "";
}

function filterValues(filter: TFilter, maxCharCount: number) {
    switch (filter.type) {
        case "options":
            return optionsFilterValues(filter as TOptionsFilter, maxCharCount);
        default:
            return "";
    }
}

interface FilterChipProps {
    filter: TFilter;
    showFilterPoper: TShowFilterPoper;
    onDelete: (filter: TFilter) => void;
    disabled?: boolean;
}

export function FilterChip(props: FilterChipProps) {
    const { filter, showFilterPoper, onDelete, disabled } = props;
    const [open, setOpen] = useState(false);
    const chipRef = useRef<HTMLElement>(undefined);
    const liveRef = useRef(false);

    useEffect(() => {
        liveRef.current = true;
        return () => {
            liveRef.current = false;
        };
    }, []);

    const handleDelete = useCallback(() => {
        onDelete(filter);
    }, [filter, onDelete]);

    const handleClick = useCallback(
        async (e: React.MouseEvent<HTMLDivElement>) => {
            setOpen(true);
            await showFilterPoper(
                filter,
                chipRef.current,
                {
                    x: e.clientX,
                    y: e.clientY,
                },
                { x: 0, y: 2 }
            );
            if (liveRef.current) {
                setOpen(false);
            }
        },
        [filter, showFilterPoper]
    );

    const label = (
        <span className={clsx("filter-chip-label", { disabled: disabled })}>
            {filter.columnName}:
            <span className="filter-chip-labels">
                {filterValues(filter, maxFilterLabelCharCount)}
            </span>
            {open ? (
                <ChevronUpIcon className="filter-chip-open-icon" />
            ) : (
                <ChevronDownIcon className="filter-chip-open-icon" />
            )}
            {Boolean(props.onDelete) && (
                <Button
                    size="small"
                    type="icon"
                    className="filter-chip-delete-button"
                    onClick={handleDelete}
                    disabled={disabled}
                    title="Remove filter"
                >
                    <CloseIcon />
                </Button>
            )}
        </span>
    );

    return (
        <ChipRoot
            ref={(ref) => {
                chipRef.current = ref as HTMLElement;
            }}
            label={label}
            className={clsx({ "filter-open": open })}
            onDelete={handleDelete}
            onClick={handleClick}
            disabled={disabled}
        />
    );
}

export interface FilterBarProps {
    disabled?: boolean;
    className?: string;
}

export function FilterBar(props: FilterBarProps) {
    const { disabled, className } = props;
    const { filters, setFilters, showFilterPoper } = useFilters();

    const onDelete = useCallback(
        (filter: TFilter) => {
            setFilters(filters.filter((f) => f !== filter));
        },
        [filters, setFilters]
    );

    return (
        <FilterBarRoot
            className={clsx(className, {
                "no-filters": filters.length === 0,
            })}
        >
            <div className="chips-content">
                {filters.map((f) => (
                    <FilterChip
                        key={f.columnKey}
                        filter={f}
                        showFilterPoper={showFilterPoper}
                        onDelete={onDelete}
                        disabled={disabled}
                    />
                ))}
            </div>
            <Button
                size="small"
                type="icon"
                className="clear-filters-button"
                onClick={() => setFilters([])}
                disabled={disabled}
                title="Remove all filters"
            >
                <CloseIcon />
            </Button>
        </FilterBarRoot>
    );
}
