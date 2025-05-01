import { ViewMessage } from "../../shared/ViewMessage";

function sendDebugMessage(message: ViewMessage<any>) {
    window.postMessage(message, "*");
}

export async function mockData() {
    try {
        const response = await fetch('/mock/test.json');
        if (!response.ok) {
            return;
        }
        const data = await response.json();

        // mock input data
        window.webViewType = "output"; // "grid" | "output"
        window.jsonData = data;
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