import { useMemo, useState } from "react";
import { Column, TRowCompare, TSortColumn } from "./avGridTypes";
import { defaultCompare } from "./avGridUtils";

export interface useSortColumnProps {
    columns: Column[]
}

export function useSortColumn(props: useSortColumnProps){
    const {columns} = props;
    const [sortColumn, setSortColumn] = useState<TSortColumn>();

    const rowCompare: TRowCompare | undefined = useMemo(() => {
        if (sortColumn) {
            const col = columns.find(c => c.key === sortColumn.key);
            return col?.rowCompare ?? defaultCompare(sortColumn.key);
        }
        return undefined;
    }, [columns, sortColumn])

    return {sortColumn, setSortColumn, rowCompare}
}