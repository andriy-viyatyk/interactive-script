import { GridColumn } from "./commands/output-grid";
import { UiText } from "./ViewMessage";

export type WebViewType = "grid" | "output";

export interface WebViewInput {
    viewType?: WebViewType;
    gridInput?: {
        jsonData?: any;
        csvData?: string;
        gridColumns?: GridColumn[];
        gridTitle?: UiText;
    };
}
