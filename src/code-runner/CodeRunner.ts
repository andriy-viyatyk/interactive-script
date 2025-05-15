import * as vscode from "vscode";
import * as path from "path";
import views from "../web-view/Views";
import { RunningProcess } from "./RunningProcess";
import vars from "../vars";
import { WebView } from "../web-view/WebView";
import commands from "../../shared/commands";
import { contextScriptRunning } from "../constants";

class CodeRunner {
    private runningProcess: Map<string, RunningProcess> = new Map();
    
    private get bottomPanelId() {
        return views.output?.id;
    }

    runProcessWithView = (filePath: string, view: WebView) => {
        const id = view.id;
        const process = new RunningProcess(view, () => {
            this.runningProcess.delete(id);
        });
        this.runningProcess.set(id, process);
        process.run(filePath);
    }

    private runSeparate = async (filePath: string) => {
        if (vars.extensionContext) {
            const view = views.createView(vars.extensionContext, "output");
            view.createOutputPanel(filePath);
            await view.whenReady;
            this.runProcessWithView(filePath, view);
        }
    }

    runFile = (filePath: string, inSeparateOutput?: boolean) => {
        if (inSeparateOutput) {
            this.runSeparate(filePath);
            return;
        }

        const existingProcess = this.runningProcess.get(this.bottomPanelId ?? "");
        if (existingProcess) {
            vscode.window.showErrorMessage("Script is already running.");
            return;
        }

        if (views.output) {
            this.runProcessWithView(filePath, views.output);
        }
    };

    stop = () => {
        const existingProcess = this.runningProcess.get(this.bottomPanelId ?? "");
        if (existingProcess) {
            existingProcess.stop();
        }
    };

    clear = () => {
        if (views.output) {
            views.output.messageToOutput(commands.clear());
        }
    };
}

const codeRunner = new CodeRunner();

export default codeRunner;
