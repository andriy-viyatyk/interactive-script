import * as vscode from "vscode";
import { RunningProcess } from "./RunningProcess";
import vars from "../vars";
import commands from "../../shared/commands";
import { BaseView, Views } from "../web-view/BaseView";
import { OutputView } from "../web-view/OutputView";

class CodeRunner {
    private runningProcess: Map<string, RunningProcess> = new Map();
    
    private get bottomPanelId() {
        return Views.output?.id;
    }

    runProcessWithView = (filePath: string, view: BaseView) => {
        const id = view.id;
        const process = new RunningProcess(view, () => {
            this.runningProcess.delete(id);
        });
        this.runningProcess.set(id, process);
        process.run(filePath);
    }

    private runSeparate = async (filePath: string) => {
        if (vars.extensionContext) {
            const view = new OutputView(vars.extensionContext, "output");
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

        if (Views.output) {
            this.runProcessWithView(filePath, Views.output);
        }
    };

    stop = () => {
        const existingProcess = this.runningProcess.get(this.bottomPanelId ?? "");
        if (existingProcess) {
            existingProcess.stop();
        }
    };

    clear = () => {
        if (Views.output) {
            Views.output.messageToOutput(commands.clear());
        }
    };
}

const codeRunner = new CodeRunner();

export default codeRunner;
