import { SetStateAction } from "react";
import { TModel } from "../../common/classes/model";
import {
    CellFocus,
    Column,
    TFilter,
} from "../../controls/AVGrid/avGridTypes";
import { resolveState } from "../../common/utils/utils";
import { TGlobalState } from "../../common/classes/state";
import { TOnGetFilterOptions } from "../../controls/AVGrid/filters/useFilters";
import { UiText, ViewMessage } from "../../../../shared/ViewMessage";
import {
    createIdColumn,
    getRowKey,
    getWorkingData,
    idColumnKey,
    removeIdColumn,
} from "../useGridData";
import {
    defaultCompare,
    filterRows,
    rowsToCsvText,
} from "../../controls/AVGrid/avGridUtils";
import { AVGridModel } from "../../controls/AVGrid/model/AVGridModel";
import {
    gridEditorChangedCommand,
    gridEditorOpenLinkCommand,
    gridEditorSaveAsCommand,
    isGridEditorChangedCommand,
    isGridEditorCommand,
} from "../../../../shared_internal/grid-editor-commands";
import { csvToRecords } from "../../common/utils/csvUtils";

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
    ctrlPressed: false
};

type GridViewState = typeof defaultGridViewState;

class GridViewModel extends TModel<GridViewState> {
    gridRef: AVGridModel<any> | undefined = undefined;
    maxRowId = 0;

    sendMessage = (message: ViewMessage<any, string>) => {
        window.vscode.postMessage(message);
    };

    onWindowMessage = (event: MessageEvent<any>) => {
        const message = event.data as ViewMessage<any, string>;
        if (message?.command) {
            if (!isGridEditorCommand(message)) {
                return;
            }

            if (isGridEditorChangedCommand(message)) {
                this.updateGridDataFromContent(message.data?.content);
            }
        }
    };

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
    };

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
        this.maxRowId = data.rows.length;
        this.state.update((s) => {
            s.isCsv = data.isCsv ?? false;
            s.columns = data.columns;
            s.rows = data.rows;
            s.title = data.title ?? "";
        });
    };

    updateGridDataFromContent = (content?: string) => {
        const { isCsv, withColumns, delimiter } = this.state.get();
        let rows = [];
        try {
            if (isCsv) {
                rows = csvToRecords(content ?? "", withColumns, delimiter);
            } else {
                rows = JSON.parse(content ?? "[]");
            }
        } catch (e) {
            console.error(e);
        }
        rows = createIdColumn(rows);
        if (this.gridRef) {
            this.gridRef.models.focus.focusFromIndex = true;
        }
        this.state.update((s) => {
            s.rows = rows;
        });
    };

    onGetOptions: TOnGetFilterOptions = (
        columns: Column[],
        filters: TFilter[],
        columnKey: string,
        search?: string
    ) => {
        const uniqueValues = new Set<any>();
        filterRows(
            this.state.get().rows,
            columns,
            search,
            filters?.filter((f) => f.columnKey !== columnKey)
        ).forEach((i) => uniqueValues.add(i[columnKey]));
        const options = Array.from(uniqueValues);
        options.sort(defaultCompare());
        return options.map((i) => ({
            value: i,
            label: i === undefined ? "(undefined)" : i === null ? "(null)" : i?.toString(),
            italic: i === undefined || i === null,
        }));
    };

    get recordsCount() {
        const rows = this.state.get().rows.length;
        const visibleRows = this.gridRef?.data.rows.length ?? rows;
        return visibleRows === rows
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
    };

    onAddRows = (count: number, insertIndex?: number) => {
        const newRows = Array.from({ length: count }, () => ({
            [idColumnKey]: (this.maxRowId++).toString(),
        }));
        this.state.update((s) => {
            if (insertIndex !== undefined) {
                s.rows.splice(insertIndex, 0, ...newRows);
            } else {
                s.rows.push(...newRows);
            }
        });
        return newRows;
    };

    onDeleteRows = (rowKeys: string[]) => {
        this.state.update((s) => {
            s.rows = s.rows.filter((r) => !rowKeys.includes(getRowKey(r)));
        });
    };

    private getCsvContent = (delimiter: string, withColumns: boolean) => {
        const { rows, columns } = this.state.get();
        return rowsToCsvText(rows, columns, withColumns, delimiter) ?? "";
    };

    private getJsonContent = () => {
        const { rows } = this.state.get();
        return JSON.stringify(removeIdColumn(rows), null, 4);
    };

    onDataChanged = () => {
        const content = this.state.get().isCsv
            ? this.getCsvContent(this.state.get().delimiter, this.state.get().withColumns)
            : this.getJsonContent();
        this.sendMessage(gridEditorChangedCommand({ content }));
    };

    onUpdateRows = (updateFunc: (rows: any[]) => any[]) => {
        const rows = this.state.get().rows;
        const updatedRows = updateFunc(rows);
        if (updatedRows !== rows) {
            this.state.update((s) => {
                s.rows = updatedRows;
            });
            this.onDataChanged();
        }
    };

    saveAsJson = () => {
        const content = this.getJsonContent();
        this.sendMessage(gridEditorSaveAsCommand({ content, format: "json" }));
    };

    saveAsCsv = () => {
        const { delimiter, withColumns, isCsv } = this.state.get();
        const content = this.getCsvContent(delimiter, isCsv ? withColumns : true);
        this.sendMessage(gridEditorSaveAsCommand({ content, format: "csv" }));
    };

    private isHoveredCell = (row: any, col: Column) => {
        const { rows, columns, hovered } = this.gridRef?.data ?? {};
        return hovered && rows && columns && hovered.row >= 0 && hovered.col >= 0
            && row === rows[hovered.row] && col === columns[hovered.col];
    };

    private isLinkCell = (row: any, col: Column) => {
        const value = row[col.key];
        return typeof value === "string" && (
            value.startsWith("http://") || value.startsWith("https://")
        );
    }

    setCtrlPressed = (pressed: boolean) => {
        this.state.update((s) => {
            s.ctrlPressed = pressed;
        });
        if (this.gridRef) {
            const hovered = this.gridRef.data.hovered;
            if (hovered.row >= 0 && hovered.col >= 0) {
                this.gridRef.update({ cells: [{row: hovered.row + 1, col: hovered.col}]})
            }
        }
    };

    getCellClass = (row: any, col: Column) => {
        if (this.isHoveredCell(row, col) && this.isLinkCell(row, col) && this.state.get().ctrlPressed) {
            return "hovered-link-cell";
        }
        return "";
    }

    cellClick = (row: any, col: Column) => {
        if (this.isLinkCell(row, col) && this.state.get().ctrlPressed) {
            const value = row[col.key];
            if (typeof value === "string") {
                this.sendMessage(gridEditorOpenLinkCommand({ url: value }));
            }
        }
    };
}

export const gridViewModel = new GridViewModel(
    new TGlobalState(defaultGridViewState)
);
