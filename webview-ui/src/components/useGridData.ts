import { useMemo } from "react";
import { GridData } from "./types";
import { Column } from "../controls/AVGrid/avGridTypes";
import { GridColumn } from "../../../shared/commands/output-grid";
import SelectColumn from "../controls/AVGrid/SelectColumn";
import { csvToRecords } from "../common/utils/csvUtils";

const charWidth = 8; // Approximate width of a character in pixels
const maxColumnWidth = 300; // Maximum column width in pixels

function detectColumns(data: any[], withSelectColumn?: boolean): Column[] {
    const columnsMap = new Map<string, Column>();
    data.forEach((row) => {
        Object.keys(row).forEach((key) => {
            let column = columnsMap.get(key);
            if (!column) {
                column = {
                    name: key,
                    key,
                    width: 100,
                    resizible: true,
                    filterType: "options",
                };
                columnsMap.set(key, column);
            }
            const value = row[key];
            if (value !== null && value !== undefined) {
                const valueStr = String(value);
                const width = Math.min(
                    Math.max(
                        Number(column.width),
                        valueStr.length * charWidth + 20
                    ), // 20px for padding
                    maxColumnWidth
                );
                column.width = width;
            }
        });
    });
    return withSelectColumn
        ? [SelectColumn, ...columnsMap.values()]
        : [...columnsMap.values()];
}

export const idColumnKey = "#intrnl-id";

export function getRowKey(row: any) {
    return row?.[idColumnKey] ?? "";
}

export function getGridData(
    jsonData: any,
    withSelectColumn?: boolean
): GridData {
    let columns: Column[] = [];
    let rows: any[] = [];

    if (jsonData) {
        if (Array.isArray(jsonData)) {
            columns = detectColumns(jsonData, withSelectColumn);
            rows = jsonData;
        } else if (jsonData instanceof Object) {
            columns = detectColumns([jsonData], withSelectColumn);
            rows = [jsonData];
        }
    }

    rows = rows.map((row, index) => ({
        ...row,
        [idColumnKey]: index.toString(),
    }));

    return { columns, rows };
}

export function removeIdColumn(rows?: any[]): any[] | undefined {
    if (!rows) return rows;
    return rows.map((row) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [idColumnKey]: _, ...rest } = row;
        return rest;
    });
}

export function getGridDataWithColumns(
    jsonData: any,
    columns?: GridColumn[],
    withSelectColumn?: boolean
): GridData {
    const gridData = getGridData(jsonData, withSelectColumn);

    let data = gridData;
    if (columns) {
        let newColumns = columns.map((column) => {
            const existing = data.columns.find((c) => c.key === column.key);
            const c: Column = {
                ...(existing ?? {}),
                key: column.key,
                name: column.title ?? column.key,
                width: column.width ?? existing?.width ?? 100,
                resizible: true,
            };
            return c;
        });
        if (withSelectColumn) {
            newColumns = [SelectColumn, ...newColumns];
        }
        data = {
            ...data,
            columns: newColumns,
        };
    }
    return data;
}

export function getWorkingData(withColumns = false, delimiter = ","): GridData {
    const jsonData = window.appInput?.gridInput?.jsonData;
    const gridColumns = window.appInput?.gridInput?.gridColumns;
    const csvData = window.appInput?.gridInput?.csvData;
    const gridTitle = window.appInput?.gridInput?.gridTitle;
    const isCsv = !jsonData && Boolean(csvData);

    let preparedData = jsonData;
    if (isCsv && csvData) {
        preparedData = csvToRecords(csvData, withColumns, delimiter);
    }

    const gridData = getGridDataWithColumns(preparedData, gridColumns);
    gridData.isCsv = isCsv;
    gridData.title = gridTitle;
    return gridData;
}

export function useGridData(
    jsonData: any,
    withSelectColumn?: boolean
): GridData {
    return useMemo(() => {
        return getGridData(jsonData, withSelectColumn);
    }, [jsonData, withSelectColumn]);
}

export function useGridDataWithColumns(
    jsonData: any,
    columns?: GridColumn[],
    withSelectColumn?: boolean,
): GridData {
    return useMemo(() => {
        return getGridDataWithColumns(jsonData, columns, withSelectColumn);
    }, [jsonData, columns, withSelectColumn]);
}

export function useWorkingData(withColumns = false, delimiter = ","): GridData {
    return useMemo(() => getWorkingData(withColumns, delimiter), [withColumns, delimiter]);
}
