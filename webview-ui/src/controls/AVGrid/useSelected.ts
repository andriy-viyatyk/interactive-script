import { useMemo } from 'react';

export interface useSelectedProps<R> {
    selected?: ReadonlySet<string>;
    rows: R[];
    getRowKey: (row: R) => string;
}

export function useSelected<R>(props: useSelectedProps<R>) {
    const {selected: propsSelected, rows, getRowKey} = props;

    const selected = useMemo(
        () => propsSelected ?? new Set<string>(), 
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [propsSelected, rows]
    );

    const allSelected = useMemo(() => {
        return selected.size > 0 && selected.size === rows.length && rows.every(r => selected.has(getRowKey(r)));
    }, [selected, rows, getRowKey])

    return {
        selected,
        allSelected
    }
}