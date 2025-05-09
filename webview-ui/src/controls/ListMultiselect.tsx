import { CSSProperties, useCallback, useMemo } from "react";
import styled from "@emotion/styled";

import { defaultOptionGetLabel } from "./utils";
import { List } from "./List";
import { CheckedIcon, UncheckedIcon } from "../theme/icons";

const ListRoot = styled(List)({
    "& .check-icon": {
        flexShrink: 0,
    }
}) as typeof List;

export interface ListMultiselectProps<O = any> {
    options: readonly O[];
    selected?: readonly O[];
    setSelected?: (selected: O[]) => void;
    getLabel?: (value: O, index?: number) => string;
    withSelectAll?: boolean;
    getOptionClass?: (value: O, index?: number) => string;
    loading?: boolean;
    getSelected?: (value: O) => boolean;
    growToHeight?: CSSProperties["height"];
}

export function ListMultiselect<O = any>(
    props: Readonly<ListMultiselectProps<O>>
) {
    const {
        options: propsOptions,
        selected,
        setSelected,
        getLabel: propsGetLabel,
        withSelectAll,
        getOptionClass,
        loading,
        getSelected,
        growToHeight,
    } = props;

    const getLabel = useCallback(
        (o: O, idx?: number) => {
            return withSelectAll && idx === 0
                ? (o as string)
                : propsGetLabel
                ? propsGetLabel(o, idx)
                : defaultOptionGetLabel(o);
        },
        [propsGetLabel, withSelectAll]
    );

    const { options, selectedAll } = useMemo(() => {
        const selectedAll: boolean =
            Boolean(propsOptions.length) &&
            propsOptions.length === (selected?.length ?? 0);
        const options = withSelectAll
            ? (["Select All", ...propsOptions] as O[])
            : propsOptions;
        return { options, selectedAll };
    }, [propsOptions, selected?.length, withSelectAll]);

    const getIcon = useCallback(
        (o: O, idx?: number) => {
            const checked =
                (idx === 0 && withSelectAll && selectedAll) ||
                (getSelected
                    ? getSelected(o)
                    : selected
                    ? selected.includes(o)
                    : false);
            return checked ? (
                <CheckedIcon className="check-icon"/>
            ) : (
                <UncheckedIcon className="check-icon"/>
            );
        },
        [selected, selectedAll, withSelectAll, getSelected]
    );

    const onClick = useCallback(
        (o: O, idx?: number) => {
            const oLabel = getLabel(o);
            if (withSelectAll && idx === 0) {
                setSelected?.(selectedAll ? [] : [...propsOptions]);
            } else if (selected?.find((i) => getLabel(i) === oLabel)) {
                setSelected?.(selected.filter((i) => getLabel(i) !== oLabel));
            } else {
                setSelected?.([
                    ...(selected?.filter((i) => getLabel(i) !== oLabel) ?? []),
                    o,
                ]);
            }
        },
        [
            propsOptions,
            selected,
            selectedAll,
            setSelected,
            withSelectAll,
            getLabel,
        ]
    );

    return (
        <ListRoot
            options={options}
            getLabel={getLabel}
            getIcon={getIcon}
            onClick={onClick}
            getOptionClass={getOptionClass}
            loading={loading}
            growToHeight={growToHeight}
        />
    );
}
