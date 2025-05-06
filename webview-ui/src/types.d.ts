import { WebViewInput } from "../../shared/types";

declare global {
    interface Window {
        appInput?: WebViewInput;
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
