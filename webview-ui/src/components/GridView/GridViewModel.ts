import { SetStateAction } from "react";
import { TModel } from "../../common/classes/model";
import { CellFocus, Column, TAVGridContext, TFilter } from "../../controls/AVGrid/avGridTypes";
import { resolveState } from "../../common/utils/utils";
import { TGlobalState } from "../../common/classes/state";
import { TOnGetFilterOptions } from "../../controls/AVGrid/filters/useFilters";
import { UiText } from "../../../../shared/ViewMessage";
import { getRowKey, getWorkingData } from "../useGridData";
import { defaultCompare, filterRows } from "../../controls/AVGrid/avGridUtils";

const defaultGridViewState = {
    isCsv: false,
    columns: [] as Column[],
    rows: [] as any[],
    title: "" as UiText,
    focus: undefined as CellFocus | undefined,
    search: "",
    withColumns: false,
    delimiter: ",",
    filters: [] as TFilter[],
};

type GridViewState = typeof defaultGridViewState;

class GridViewModel extends TModel<GridViewState> {
    gridRef: TAVGridContext | undefined = undefined;

    setFocus = (focus?: SetStateAction<CellFocus | undefined>) => {
        this.state.update((s) => {
            s.focus = focus ? resolveState(focus, () => s.focus) : undefined;
        });
    };

    setSearch = (search: string) => {
        this.state.update((s) => {
            s.search = search;
        });
    };

    clearSearch = () => {
        this.state.update((s) => {
            s.search = "";
        });
    };

    toggleWithColumns = () => {
        this.state.update((s) => {
            s.withColumns = !s.withColumns;
        });
        this.updateGridData();
    }

    setDelimiter = (delimiter: string) => {
        this.state.update((s) => {
            s.delimiter = delimiter || ",";
        });
        this.updateGridData();
    };

    setFilters = (value: SetStateAction<TFilter[]>) => {
        this.state.update((s) => {
            s.filters = resolveState(value, () => this.state.get().filters);
        });
    };

    updateGridData = () => {
        const { withColumns, delimiter } = this.state.get();
        const data = getWorkingData(withColumns, delimiter);
        this.state.update((s) => {
            s.isCsv = data.isCsv ?? false;
            s.columns = data.columns;
            s.rows = data.rows;
            s.title = data.title ?? "";
        });
    }

    onGetOptions: TOnGetFilterOptions = (
        columns: Column[],
        filters: TFilter[],
        columnKey: string,
        search?: string,
    ) => {
        const uniqueValues = new Set<any>();
		filterRows(
			this.state.get().rows,
			columns,
			search,
			filters?.filter(f => f.columnKey !== columnKey),
		).forEach(i => uniqueValues.add(i[columnKey]));
		const options = Array.from(uniqueValues);
		options.sort(defaultCompare());
		return options.map(i => ({
			value: i,
			label: i?.toString(),
		}));
    }

    get recordsCount() {
        const rows = this.state.get().rows.length;
        const visibleRows = this.gridRef?.rows.length ?? rows;
        return (visibleRows === rows)
            ? `[${rows} rows]`
            : `[${visibleRows} of ${rows} rows]`;
    }

    editRow = (columnKey: string, rowKey: string, value: any) => {
        this.state.update((s) => {
            const row = s.rows.find((r) => getRowKey(r) === rowKey);
            if (row) {
                (row as any)[columnKey] = value;
            }
        });
    }
}

export const gridViewModel = new GridViewModel(new TGlobalState(defaultGridViewState));