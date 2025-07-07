import { GridColumn } from "./commands/output-grid";
import { UiText } from "./ViewMessage";

export type WebViewType = "grid" | "output" | "graph" | "json";

export interface WebViewInput {
    viewType?: WebViewType;
    gridInput?: {
        jsonData?: any;
        csvData?: string;
        gridColumns?: GridColumn[];
        gridTitle?: UiText;
    };
    outputInput?: {
        withHeader?: boolean;
        title?: string;
        filePath?: string;
    };
    graphInput?: {
        jsonData?: any;
        graphTitle?: UiText;
    };
}
