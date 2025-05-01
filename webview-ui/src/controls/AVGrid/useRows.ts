import { useMemo } from "react";
import { Column, TRowCompare, TSortDirection } from "./avGridTypes";
import { filterRows } from "./avGridUtils";

export interface useRowsProps<R> {
    rows: R[];
    columns: Column<R>[];
    rowCompare?: TRowCompare<R>;
    sortDirection?: TSortDirection;
    searchString?: string;
}

export function useRows<R>(props: useRowsProps<R>){
    const {rows, columns, rowCompare, searchString, sortDirection } = props;

    const filtered = useMemo(
        () => filterRows(rows, columns, searchString),
        [rows, columns, searchString]
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