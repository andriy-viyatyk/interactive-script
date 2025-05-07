import { useMemo } from "react";
import { isNullOrUndefined } from "../common/utils/utils";

export const emptyLabel = "(empty)";

export const defaultOptionGetLabel = (o: any): string => {
    let value = "";
    if (!isNullOrUndefined(o)) {
        switch (typeof o) {
            case "boolean":
                value = o.toString();
                break;
            case "object":
                value = o.label ?? o.toString?.() ?? "";
                break;
            default:
                value = o.toString?.() ?? "";
        }
    }

    return isNullOrUndefined(value) || value === "" ? emptyLabel : value;
};

export function useFilteredOptions<O = any>(
    options: readonly O[],
    searchString?: string,
    getLabel?: (o: O, index: number) => string
) {
    return useMemo(() => {
        if (!searchString) {
            return options;
        }
        const searchStringLower = searchString.toLocaleLowerCase();
        return options.filter((o, idx) => {
            const label: string = getLabel
                ? getLabel(o, idx)
                : defaultOptionGetLabel(o);
            return (
                label &&
                label.toLowerCase &&
                label.toLowerCase().includes(searchStringLower)
            );
        });
    }, [options, searchString, getLabel]);
}