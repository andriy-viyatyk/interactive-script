import moment from "moment";

import { isNullOrUndefined } from "../../common/utils/utils";
import { Column, TDisplayFormat } from "./avGridTypes";
import { recordsToCsv } from "../../common/utils/csvUtils";

export const defaultCompare =
    (propertyKey?: string) =>
    (left: any, right: any): number => {
        const leftV = propertyKey ? left?.[propertyKey] : left;
        const rightV = propertyKey ? right?.[propertyKey] : right;

        if (isNullOrUndefined(leftV) !== isNullOrUndefined(rightV)) {
            return isNullOrUndefined(leftV) ? -1 : 1;
        }

        if (typeof leftV === "number" && typeof rightV === "number") {
            return leftV - rightV;
        }

        if (typeof leftV === "string" && typeof rightV === "string") {
            return leftV.localeCompare(rightV);
        }

        if (leftV instanceof Date && rightV instanceof Date) {
            return leftV.getTime() - rightV.getTime();
        }

        if (typeof leftV === "boolean" && typeof rightV === "boolean") {
            if (leftV === rightV) return 0; 
            return leftV ? 1 : -1;
        }

        return 0;
    };

export function formatDispayValue(
    value: any,
    format: TDisplayFormat = "text"
): string {
    if (isNullOrUndefined(value)) {
        return "";
    }

    switch (format) {
        case "text":
            if (value instanceof Date) {
                return value.toLocaleString();
            }
            if (value || typeof value === "boolean") {
                return value.toString();
            }
            break;
        case "date":
        case "dateTime": {
            if (value instanceof Date) {
                return format === "date"
                    ? value.toLocaleDateString()
                    : value.toLocaleString();
            }
            if (typeof value === "string") {
                const dt = new Date(value);
                if (Number.isNaN(dt.getTime())) return "";
                return format === "date"
                    ? dt.toLocaleDateString()
                    : dt.toLocaleString();
            }
            break;
        }
        case "phone":
            if (typeof value === "string") {
                return value.length === 10
                    ? `(${value.substring(0, 3)}) ${value.substring(
                          3,
                          6
                      )}-${value.substring(6)}`
                    : value;
            }
            break;
        default:
            break;
    }

    if (format.startsWith("date:")) {
        const formatStr = format.substring(5);
        return moment(value).format(formatStr);
    }

    if (format.startsWith("utcToLocal:")) {
        const formatStr = format.substring(11);
        return moment.utc(value).local().format(formatStr);
    }

    return "";
}

function searchStringMatch<R>(
    row: R,
    columns: Column<R>[],
    searchLower?: string
) {
    if (searchLower) {
        return columns.some((c) => {
            const value = formatDispayValue(
                row[c.key as keyof R],
                c.displayFormat
            )
                ?.toString()
                .toLowerCase();

            return value && value.indexOf(searchLower) >= 0;
        });
    }
    return true;
}

export function filterRows<R>(
    rows: readonly R[],
    columns: Column<R>[],
    searchString?: string
): readonly R[] {
    if (!searchString?.length) {
        return rows;
    }
    const searchLower = searchString
        ?.toLowerCase()
        .split(" ")
        .filter((s) => s);
    const filtered = rows.filter((r) => {
        if (!r) return false;
        const sMatch = searchLower.every((s) =>
            searchStringMatch(r, columns, s)
        );
        return sMatch;
    });

    return filtered;
}

export function falseString(v: any) {
    return (
        v &&
        typeof v === "string" &&
        (v.toLowerCase() === "false" || v.toLowerCase() === "no")
    );
}

export function columnDisplayValue(column: Column<any>, row: any) {
    if (column.formatValue) return column.formatValue(column, row);

    return column.displayFormat
        ? formatDispayValue(row[column.key], column.displayFormat)
        : row[column.key];
}

export function rowsToCsvText(
    rows?: any[],
    columns?: Column<any>[],
    withHeaders?: boolean,
    tabDelimeter?: boolean
): string | undefined {
    if (!rows?.length || !columns?.length) return undefined;

    const processRow = (row: any) =>
        columns.reduce<{ [key: string]: any }>((acc, c) => {
            acc[c.name] = columnDisplayValue(c, row);
            return acc;
        }, {});

    const records = [...rows.map((row) => processRow(row))];
    const columnKeys = columns.map((c) => c.name);

    return recordsToCsv(records, columnKeys, {
        header: withHeaders,
        delimiter: tabDelimeter ? "\t" : ",",
    });
}
