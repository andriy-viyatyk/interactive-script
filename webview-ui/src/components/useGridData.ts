import { useMemo } from "react";
import { GridData } from "./types";
import { Column } from "../controls/AVGrid/avGridTypes";
import { GridColumn } from "../../../shared/commands/grid";

const charWidth = 8; // Approximate width of a character in pixels
const maxColumnWidth = 300; // Maximum column width in pixels

function getColumns(data: any[]): Column[] {
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
                }
                columnsMap.set(key, column);
            }
            const value = row[key];
            if (value !== null && value !== undefined) {
                const valueStr = String(value);
                const width = Math.min(
                    Math.max(Number(column.width), valueStr.length * charWidth + 20), // 20px for padding
                    maxColumnWidth
                );
                column.width = width;
            }
        });
    });
    return [...columnsMap.values()];
}

export const idColumnKey = "#intrnl-id";

export function getRowKey(row: any) {
    return row?.[idColumnKey] ?? "";
}

export function useGridData(jsonData: any): GridData {
    return useMemo(() => {
        let columns: Column[] = [];
        let rows: any[] = [];

        if (jsonData) {
            if (Array.isArray(jsonData)) {
                columns = getColumns(jsonData);
                rows = jsonData;
            } else if (jsonData instanceof Object) {
                columns = getColumns([jsonData]);
                rows = [jsonData];
            }
        }

        rows = rows.map((row, index) => ({
            ...row,
            [idColumnKey]: index.toString(),
        }))

        return { columns, rows };
    }, [jsonData])
}

export function useGridDataWithColumns(jsonData: any, columns?: GridColumn[]): GridData {
    const gridData = useGridData(jsonData);

    return useMemo(() => {
        let data = gridData;
        if (columns) {
            const newColumns = columns.map((column) => {
                const existing = data.columns.find((c) => c.key === column.key);
                const c: Column = {
                    ...(existing ?? {}),
                    key: column.key,
                    name: column.title ?? column.key,
                    width: column.width ?? existing?.width ?? 100,
                    resizible: true,
                }
                return c;
            });
            data = {
                ...data,
                columns: newColumns,
            };
        }
        return data;
    }, [gridData, columns]);
}

export function useWorkingData(): GridData {
    const jsonData = window.jsonData;
    const gridColumns = window.gridColumns;
    return useGridDataWithColumns(jsonData, gridColumns);
}