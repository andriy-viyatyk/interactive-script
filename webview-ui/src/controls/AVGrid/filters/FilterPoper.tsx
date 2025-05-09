import { useCallback } from "react";
import styled from "@emotion/styled";

import { TOnGetFilterOptions, useFilters } from "./useFilters";
import { TFilter, TOptionsFilter } from "../avGridTypes";
import { useAVGridContext } from "../useAVGridContext";
import { OptionsFilterContent } from "./OptionsFilterContent";
import { Popper } from "../../Popper";

const PopperRoot = styled(Popper)({
    display: "flex",
    flexDirection: "column",
    overflow: "visible",
    borderRadius: 6,
});

const minWidth = 184;

interface FilterContentProps {
    filter: TFilter;
    onApplyFilter: (filter: TFilter) => void;
    onGetOptions: TOnGetFilterOptions;
    width?: number;
}

function FilterContent(props: FilterContentProps) {
    const { filter, onApplyFilter, onGetOptions, width } = props;
    const { columns } = useAVGridContext();
    const filterType =
        columns.find((c) => c.key === filter.columnKey)?.filterType ??
        filter.type;

    switch (filterType) {
        case "options":
            return (
                <OptionsFilterContent
                    filter={filter as TOptionsFilter}
                    onApplyFilter={onApplyFilter}
                    onGetOptions={onGetOptions}
                    width={width}
                    columnFilterType={filterType}
                />
            );
        default:
            return null;
    }
}

export function FilterPoper() {
    const { poperData, onGetOptions } = useFilters();

    const onApplyFilter = useCallback(
        (filter: TFilter) => {
            poperData?.onApplyFilter(filter);
            poperData?.closeFilterPoper();
        },
        [poperData]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Escape") {
                poperData?.closeFilterPoper();
            }
        },
        [poperData]
    );

    if (!poperData) {
        return null;
    }
    const { filter, position, anchorEl, adjustPosition, closeFilterPoper } =
        poperData;

    return (
        <PopperRoot
            open
            elementRef={anchorEl}
            x={position?.x}
            y={position?.y}
            placement="bottom-start"
            onClose={closeFilterPoper}
            offset={
                adjustPosition
                    ? [adjustPosition.x, adjustPosition.y]
                    : undefined
            }
            onKeyDown={handleKeyDown}
        >
            <FilterContent
                filter={filter}
                onApplyFilter={onApplyFilter}
                onGetOptions={onGetOptions}
                width={Math.max(minWidth, anchorEl?.clientWidth ?? 0)}
            />
        </PopperRoot>
    );
}
