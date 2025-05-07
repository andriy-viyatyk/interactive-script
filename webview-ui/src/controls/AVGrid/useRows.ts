import { useMemo } from "react";
import { Column, TFilter, TRowCompare, TSortDirection } from "./avGridTypes";
import { filterRows } from "./avGridUtils";

export interface useRowsProps<R> {
    rows: R[];
    columns: Column<R>[];
    rowCompare?: TRowCompare<R>;
    sortDirection?: TSortDirection;
    searchString?: string;
    filters?: TFilter[];
}

export function useRows<R>(props: useRowsProps<R>){
    const {rows, columns, rowCompare, searchString, sortDirection, filters } = props;

    const filtered = useMemo(
        () => filterRows(rows, columns, searchString, filters),
        [rows, columns, searchString, filters]
    );

    const sorted = useMemo(() => {
        let res = [...filtered];

        if (rowCompare){   
            res.sort((a, b) => rowCompare(a, b));
            if (sortDirection === "desc") {
                res = res.reverse();
            }
        }

        return res;
    }, [filtered, rowCompare, sortDirection]);

    return sorted;
}