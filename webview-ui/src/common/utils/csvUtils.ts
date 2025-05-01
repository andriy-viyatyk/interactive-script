import { stringify } from "csv-stringify/browser/esm/sync";
import { parse } from "csv-parse/browser/esm/sync";

export function recordsToCsv(records: Array<any>, columns: Array<string | undefined>, options = {}): string {
    return stringify(records, 
        {
            header: true, 
            columns: columns.map(col => col === undefined ? "undefined" : col), 
            cast: {
                boolean: (value: any) => ({value: value ? 'true': 'false', quote: false})
            },
            ...options,
        }
    );
}

export function csvToRecords(csv: string, withColumns = false, delimiter = '\t'): Array<any> {
    try{
        if (!csv){
            return [];
        }
        return parse(csv, {
            columns: withColumns,
            skip_empty_lines: true,
            delimiter,
          })
    } catch (e){
        console.error(e);
        return [];
    }
}