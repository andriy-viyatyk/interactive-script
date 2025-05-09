import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { Column, TAnyFilter, TDisplayOption, TFilter, TPoint } from "../avGridTypes";
import { isNullOrUndefined } from "../../../common/utils/utils";

export type TOnGetFilterOptions = (
    columns: Column[],
    filters: TFilter[],
    columnKey: string,
    search?: string,
) => TDisplayOption[] | Promise<TDisplayOption[]>;

export interface IFiltersProviderContext {
    filters: TFilter[];
    setFilters: (filters: TFilter[]) => void;
    onGetOptions: TOnGetFilterOptions;
    configName?: string;
}

export type TShowFilterPoper = (
    filter: TFilter,
    anchorEl?: HTMLElement,
    position?: TPoint,
    adjustPosition?: TPoint
) => void;

interface IPoperData {
    filter: TFilter;
    position?: TPoint;
    anchorEl?: HTMLElement;
    adjustPosition?: TPoint;
    onClose: () => void;
    onApplyFilter: (filter: TFilter) => void;
    closeFilterPoper: () => void;
}

export interface IFiltersContext extends IFiltersProviderContext {
    showFilterPoper: TShowFilterPoper;
    poperData?: IPoperData;
}

const FiltersContext = createContext<IFiltersContext | undefined>(undefined);

interface FiltersProviderProps extends IFiltersProviderContext {
    children: ReactNode;
}

const configKey = (configName: string) => `Filters-${configName}`;
const configVersion = "1"; // change version if old version cannot be deserialized into changed structure;

function saveFiltersConfig(filters: TFilter[], configName?: string) {
    if (!configName) return;
    localStorage.setItem(
        configKey(configName),
        JSON.stringify({ configVersion, filters })
    );
}

export function filtersConfigExists(configName: string): boolean {
    return  Boolean(configName && localStorage.getItem(configKey(configName)));
}

const dateRegex =
    /^\d{4}-(0\d|1[0-2])-([0-2]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)\.\d{3}Z$/;

export function restoreFiltersConfig(configName: string): TFilter[] {
    try {
        const configStr = localStorage.getItem(configKey(configName));
        const config = configStr && JSON.parse(configStr);
        if (
            config &&
            config.configVersion === configVersion &&
            Array.isArray(config.filters)
        ) {
            return config.filters.map((filter: any) => {
                // convert serialized Dates to Date type
                if (Array.isArray(filter.value)) {
                    const valueExample = filter.value[0];
                    if (
                        ["date", "dateTime"].includes(filter.type) ||
                        (valueExample &&
                            typeof valueExample === "string" &&
                            dateRegex.test(valueExample))
                    ) {
                        return {
                            ...filter,
                            value: filter.value.map((v: any) =>
                                !isNaN(new Date(v ?? "").getTime())
                                    ? new Date(v)
                                    : undefined
                            ),
                        };
                    }
                }
                return filter;
            });
        }

        return [];
    } catch (e: any) {
        console.warn(e.message ? e.message : e);
    }
    return [];
}

export function FiltersProvider(props: FiltersProviderProps) {
    const { filters, setFilters, onGetOptions, children, configName } = props;
    const [poperData, setPoperData] = useState<IPoperData>();
    const onClose = useCallback(() => {
        setPoperData((old) => {
            old?.onClose();
            return undefined;
        });
    }, []);

    const setFiltersProxy = useCallback<(filters: TFilter[]) => void>(
        (filters) => {
            setFilters(filters);
            saveFiltersConfig(filters, configName);
        },
        [configName, setFilters]
    );

    const onApplyFilter = useCallback(
        (filter: TFilter) => {
            let newFilters = [...filters];
            if (isNullOrUndefined((filter as TAnyFilter).value)) {
                newFilters = newFilters.filter(
                    (f) => f.columnKey !== filter.columnKey
                );
            } else {
                const current = newFilters.find(
                    (f) => f.columnKey === filter.columnKey
                );
                if (current) {
                    newFilters = newFilters.map((f) =>
                        f.columnKey === filter.columnKey ? filter : f
                    );
                } else {
                    newFilters.push(filter);
                }
            }

            setFiltersProxy(newFilters);
        },
        [filters, setFiltersProxy]
    );

    const showFilterPoper = useCallback<TShowFilterPoper>(
        (filter, anchorEl, position, adjustPosition) => {
            return new Promise((resolve) => {
                const existing: TFilter =
                    filters.find((f) => f.columnKey === filter.columnKey) ??
                    filter;

                setPoperData({
                    filter: existing,
                    position,
                    anchorEl,
                    adjustPosition,
                    onClose: () => resolve(undefined),
                    onApplyFilter,
                    closeFilterPoper: onClose,
                });
            });
        },
        [filters, onApplyFilter, onClose]
    );

    const providerValue = useMemo(
        () => ({
            filters,
            setFilters: setFiltersProxy,
            onGetOptions,
            showFilterPoper,
            configName,
            poperData,
        }),
        [
            filters,
            setFiltersProxy,
            onGetOptions,
            showFilterPoper,
            configName,
            poperData,
        ]
    );

    return (
        <FiltersContext.Provider value={providerValue}>
            {children}
        </FiltersContext.Provider>
    );
}

export function useFilters() {
    const filtersContext = useContext(FiltersContext);

    return filtersContext === undefined
        ? {
            filters: [],
            setFilters: () => { },
            showFilterPoper: () => { },
            onGetOptions: () => [],
        }
        : {
            filters: filtersContext.filters,
            setFilters: filtersContext.setFilters,
            showFilterPoper: filtersContext.showFilterPoper,
            poperData: filtersContext.poperData,
            onGetOptions: filtersContext.onGetOptions,
        };
}
