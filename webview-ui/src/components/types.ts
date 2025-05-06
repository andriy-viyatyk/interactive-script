import { UiText } from "../../../shared/ViewMessage";
import { Column } from "../controls/AVGrid/avGridTypes";

export interface GridData {
    isCsv?: boolean;
    columns: Column[];
    rows: any[];
    title?: UiText;
}