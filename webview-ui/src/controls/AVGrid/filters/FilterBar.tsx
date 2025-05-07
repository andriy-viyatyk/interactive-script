import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";

import { TShowFilterPoper, useFilters } from "./useFilters";
import { TFilter, TOptionsFilter } from "../avGridTypes";
import { formatDispayValue } from "../avGridUtils";
import { ChevronDownIcon, ChevronUpIcon, CloseIcon } from "../../../theme/icons";
import { Chip } from "../../Chip";
import { Button } from "../../Button";

const ChipRoot = styled(Chip)({
    cursor: "pointer",
    "& .filter-chip-label": {
        display: "flex",
        alignItems: "center",
        "& .filter-chip-labels": {
            flex: "1 1 auto",
            color: '#100817',
            marginLeft: 4,
            textOverflow: "ellipsis",
            overflow: "hidden",
            paddingRight: 2,
        },
        "& .filter-chip-open-icon": {
            height: 16,
            padding: "0 4px",
            borderRight: `solid 1px #BDBEC7`,
        },
        "&.disabled": {
            color: '#6C6F7F',
        },
        "& .empty-label": {
            fontStyle: "italic",
        },
    },
    "&.filter-open": {
        outline: `solid 1px #D3D2DA`,
        backgroundColor: '#F1F0F4',
    },
});

const FilterBarRoot = styled.div({
    padding: 8,
    minHeight: 40,
    border: `solid 1px rgb(224, 224, 224)`,
    backgroundColor: "white",
    margin: 8,
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
    "& .clear-filters-button": {},
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
            <React.Fragment key={ ++idx }>
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
        return () => { liveRef.current = false; }
    }, [])

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
                { x: 0, y: -2 }
            );
            if (liveRef.current) { setOpen(false); }
        },
        [filter, showFilterPoper]
    );

    const label = (
        <span className={clsx("filter-chip-label", { "disabled": disabled })}>
            {filter.columnName}
            <span className="filter-chip-labels">
                {filterValues(filter, maxFilterLabelCharCount)}
            </span>
            <span className="filter-chip-open-icon">
                {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </span>
        </span>
    );

    return (
        <ChipRoot
            ref={(ref) => {chipRef.current = ref as HTMLElement}}
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
                className="clear-filters-button"
                onClick={() => setFilters([])}
                disabled={disabled}
                title="Reset filters"
            >
                <CloseIcon />
            </Button>
        </FilterBarRoot>
    );
}
