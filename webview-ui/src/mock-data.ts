import { WebViewInput } from "../../shared/types";
import { ViewMessage } from "../../shared/ViewMessage";
import { parseJson } from "./common/utils/utils";

function sendDebugMessage(message: ViewMessage<any>) {
    window.postMessage(message, "*");
}

export async function mockData() {
    try {
        const response = await fetch('/mock/test.json'); // test.json or test.csv
        if (!response.ok) {
            return;
        }
        const data = await response.text();
        const jsonData = parseJson(data);

        const graphResponse = await fetch('/mock/miserables.json'); // graph.json
        if (!graphResponse.ok) {
            return;
        }
        const graphData = await graphResponse.json();

        // mock input data
        const appInput: WebViewInput = {
            viewType: "grid",  // "grid" | "output" | "graph"
            gridInput: {
                jsonData: jsonData, //.slice(0, 10),
                csvData: !jsonData && data ? data : undefined,
                gridTitle:["Test ", {text: "Grid", styles: {color: "pink"}}],
            },
            outputInput: {
                title: "[test.ts]",
                filePath: "d:/projects/interactive-script/test/test.ts",
                withHeader: true,
            },
            graphInput: {
                jsonData: graphData,
                graphTitle: ["Test ", {text: "Graph", styles: {color: "blue"}}],
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