import React, { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';

import { ListMultiselect } from "../../ListMultiselect";
import { TDisplayOption, TFilterType, TOptionsFilter } from "../avGridTypes";
import { TOnGetFilterOptions, useFilters } from "./useFilters";
import { useAVGridContext } from '../useAVGridContext';
import { useResolveOptions } from '../../useResolveOptions';
import { emptyLabel, useFilteredOptions } from '../../utils';
import { TextField } from '../../TextField';
import { Button } from '../../Button';

const OptionsFilterContentRoot = styled.div<{width: CSSProperties["width"]}>(props => ({
    width: props.width,
    "& .list-container": {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        padding: '0 4px',
    },
    "& .inputWrapper": {
        padding: "4px 4px 8px 4px",
        "& input": {
            width: "100%",
            minWidth: 40,
            padding: "0 4px",
            height: 24,
        }
    },
    "& .buttonsContainer": {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        columnGap: 12,
        padding: 4,
        "& .button__container": {
            width: 86,
            flex: "1 1 auto",
        },
    },
    "& .empty-option": {
        fontStyle: 'italic',
    }
}));

const minWidth = 260;
const getLabel = (o: TDisplayOption) => o.label;

interface OptionsFilterContentProps {
    filter: TOptionsFilter;
    onApplyFilter: (filter: TOptionsFilter) => void;
    width?: number;
    onGetOptions: TOnGetFilterOptions;
    columnFilterType: TFilterType;
}

export function OptionsFilterContent(props: Readonly<OptionsFilterContentProps>) {
    const { filter, onApplyFilter, width = minWidth, onGetOptions } = props;
    const [text, setText] = useState<string>("");
    const [selected, setSelected] = useState<TDisplayOption[]>(
        filter.type === 'options' && Array.isArray(filter.value) 
            ? filter.value 
            : []
    );
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const { filters } = useFilters();
    const { columns } = useAVGridContext();

    useEffect(() => {
        inputRef.current?.focus();
    }, [])

    const optionsOrPromise = useMemo(() => {
        return onGetOptions(
            columns,
            filters,
            filter.columnKey,
            undefined,
        )
    }, [onGetOptions, filter.columnKey, columns, filters])

    const [options, loading] = useResolveOptions<TDisplayOption>(optionsOrPromise);

    const reorderedOptions = useMemo(() => {
        if (filter.type === 'options' && Array.isArray(filter.value) && options.length) {
            const sel = options.filter(o => filter.value?.find(v => v.value === o.value));
            return [...sel, ...options.filter(o => !sel.includes(o))];
        } 
        return [...options]
    }, [filter, options])

    const filteredOptions = useFilteredOptions(reorderedOptions, text, getLabel);

    const getOptionClass = useCallback((row: TDisplayOption) => {
        if (!row.value && row.label === emptyLabel) {
            return "empty-option";
        }
        return "";
    }, [])

    const handleChange = useCallback<(value: string) => void>(value => {
        setText(value);
    }, [])

    const onApply = useCallback(() => {
        if (filter.type === "options") {
            const applySelected = selected.filter((o, idx, arr) => arr.findIndex(i => i.label === o.label && i.value === o.value) === idx);
            onApplyFilter({ ...filter, type: filter.type, value: applySelected.length ? applySelected : undefined });
        }
        
    }, [filter, onApplyFilter, selected]);

    const onClear = useCallback(() => {
        onApplyFilter({ ...filter, value: undefined });
    }, [filter, onApplyFilter]);

    const getSelected = useCallback((o: TDisplayOption) => {
        return Boolean(selected.find(i => i.value === o.value))
    }, [selected])

    return (
        <OptionsFilterContentRoot width={Math.max(width, minWidth)}>
            <div className="inputWrapper">
                <TextField 
                    value={text} 
                    onChange={handleChange} 
                    ref={ref => {inputRef.current = ref}}
                />
            </div>
            <div className='list-container'>
                <ListMultiselect
                    withSelectAll
                    options={filteredOptions}
                    selected={selected}
                    setSelected={setSelected}
                    getLabel={getLabel}
                    loading={loading}
                    getOptionClass={getOptionClass}
                    getSelected={getSelected}
                    growToHeight={240}
                />
            </div>  
            <div className="buttonsContainer">
                <Button
                    onClick={onApply}
                    disabled={!selected.length}
                >
                    Apply
                </Button>
                <Button
                    onClick={onClear}
                >
                    Clear
                </Button>
            </div>
        </OptionsFilterContentRoot>
    )
}