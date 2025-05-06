import { WebViewInput } from "../../shared/types";
import { ViewMessage } from "../../shared/ViewMessage";
import { parseJson } from "./common/utils/utils";

function sendDebugMessage(message: ViewMessage<any>) {
    window.postMessage(message, "*");
}

export async function mockData() {
    try {
        const response = await fetch('/mock/test.csv'); // test.json or test.csv
        if (!response.ok) {
            return;
        }
        const data = await response.text();
        const jsonData = parseJson(data);

        // mock input data
        const appInput: WebViewInput = {
            viewType: "grid",  // "grid" | "output"
            gridInput: {
                jsonData: jsonData,
                csvData: !jsonData && data ? data : undefined,
            },
        }
        window.appInput = appInput;
        window.sendDebugMessage = sendDebugMessage;
        window.isDebug = true;
        window.vscode = {
            postMessage: (message: any) => {
                console.log("Message sent to VSCode:", message);
            },
            setState: (state: any) => {
                console.log("State set in VSCode:", state);
            },
            getState: () => {
                return { someState: "example" };
            },
        };
    } catch (error) {
        console.error('Failed to load test.json:', error);
    }
}