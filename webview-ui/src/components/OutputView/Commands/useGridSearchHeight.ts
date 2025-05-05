import { useCallback, useRef, useState } from "react";

export function useGridSearchHeight() {
    const [search, setSearch] = useState<string>("");
        const gridWrapperRef = useRef<HTMLDivElement>(null);
        const [gridWrapperHeight, setGridWrapperHeight] = useState<number | undefined>(
            undefined
        );
    
        const setSearchProxy = useCallback((value: string) => {
            if (!value && gridWrapperHeight) {
                setGridWrapperHeight(undefined);
            } else if (value && !gridWrapperHeight) {
                setGridWrapperHeight(gridWrapperRef.current?.clientHeight);
            }
            setSearch(value);
        }, [gridWrapperHeight]);

    return {
        search,
        setSearch: setSearchProxy,
        gridWrapperRef,
        gridWrapperHeight,
    }
}