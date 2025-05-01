import { GridColumn } from "../../shared/commands/grid";

declare global {
    interface Window {
        webViewType: string;
        jsonData: any;
        gridColumns?: GridColumn[];
        sendDebugMessage: (message: any) => void;
        isDebug: boolean;
        vscode: {
            postMessage: (message: any) => void;
            setState: (state: any) => void;
            getState: () => any;
        };
    }
}

export {};
