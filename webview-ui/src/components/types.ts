import { Column } from "../controls/AVGrid/avGridTypes";

export interface GridData {
    isCsv?: boolean;
    columns: Column[];
    rows: any[];
}