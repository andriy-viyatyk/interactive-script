import { useCallback, useRef } from "react";
import { useItemState } from "../OutputViewContext";

export function useGridSearchHeight(id: string) {
    const [search, setSearch] = useItemState<string>(id, "search", "");
        const gridWrapperRef = useRef<HTMLDivElement>(null);
        const [gridWrapperHeight, setGridWrapperHeight] = useItemState<number | undefined>(id, "gridWrapperHeight", undefined);

        const setSearchProxy = useCallback((value: string) => {
            if (!value && gridWrapperHeight) {
                setGridWrapperHeight(undefined);
            } else if (value && !gridWrapperHeight) {
                setGridWrapperHeight(gridWrapperRef.current?.clientHeight);
            }
            setSearch(value);
        }, [gridWrapperHeight, setGridWrapperHeight, setSearch]);

    return {
        search,
        setSearch: setSearchProxy,
        gridWrapperRef,
        gridWrapperHeight,
    }
}