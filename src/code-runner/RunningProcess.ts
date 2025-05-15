import * as cp from "child_process";
import * as vscode from "vscode";
import * as path from "path";
import { contextScriptRunning } from "../constants";
import { WebView } from "../web-view/WebView";
import commands from "../../shared/commands";
import { commandLine } from "../../shared/constants";
import {
    isWindowGridCommand,
    isWindowTextCommand,
    WindowGridCommand,
    WindowTextCommand,
} from "../../shared/commands/window";
import vars from "../vars";
import views from "../web-view/Views";
import { ViewMessage } from "../../shared/ViewMessage";
import { SubscriptionObject } from "../utils/events";
import { isScriptStopCommand } from "../../shared/commands/script";
import { handleWindowGridCommand, handleWindowTextCommand } from "../utils/common-commands";

export class RunningProcess extends vscode.Disposable {
    private child: cp.ChildProcessWithoutNullStreams | null = null;
    private fileName: string = "";
    private view?: WebView;
    private viewIsBottomPanel = false;
    private subscriptions: SubscriptionObject[] = [];

    constructor(view: WebView, callOnDispose: () => any) {
        super(callOnDispose);
        this.view = view;
        this.viewIsBottomPanel = view.isBottomPanel;

        const onDispose = view.onDispose.subscribe(() => {
            this.view = undefined;
            this.dispose();
        });
        if (onDispose) {
            this.subscriptions.push(onDispose);
        }

        const onMessage = view.onOutputMessage.subscribe(this.onWebViewMessage);
        if (onMessage) {
            this.subscriptions.push(onMessage);
        }
    }

    get isRunning() {
        return Boolean(this.child);
    }

    private set isRunning(value: boolean) {
        if (this.viewIsBottomPanel) {
            vscode.commands.executeCommand(
                "setContext",
                contextScriptRunning,
                value
            );
        }

        if (this.child) {
            this.child.kill("SIGKILL");
            this.child = null;
        }
    }

    stop = () => {
        if (this.child) {
            this.child.kill("SIGKILL");
        }
    };

    clear = () => {
        this.view?.messageToOutput(commands.clear());
    };

    private onLine = (line: string) => {
        if (this.handleCommand(line)) return;

        this.view?.messageToOutput(commands.log.log(line));
    };

    private onError = (error: string) => {
        this.view?.messageToOutput(commands.log.error(error));
    };

    private onStdout = (data: Buffer) => {
        if (!this.isRunning) return;
        const text = data.toString();
        const lines = text.split("\n");
        if (lines.length && lines[lines.length - 1] === "") {
            lines.pop();
        }
        lines.forEach(this.onLine);
    };

    private onStderr = (data: Buffer) => {
        if (!this.isRunning) return;
        const text = data.toString();
        const lines = text.trim().split("\n");
        if (lines.length && lines[lines.length - 1] === "") {
            lines.pop();
        }
        lines.forEach(this.onError);
    };

    private onExit = (code: number | null) => {
        if (!this.isRunning) return;

        setTimeout(() => {
            // some time for the output to be flushed
            this.view?.messageToOutput(
                commands.log.log([
                    {
                        text: `[ ${this.fileName} ]`,
                        styles: { color: "lightseagreen" },
                    },
                    ` exit code ${code}`,
                ])
            );
            this.view?.messageToOutput(commands.script.stop());
            this.dispose();
        }, 100);
    };

    private onWebViewMessage = (message?: ViewMessage<any>) => {
        if (message?.command) {
            if (isScriptStopCommand(message)) {
                this.stop();
                return;
            }

            if (!this.child) return;

            this.child.stdin.write(
                `${commandLine}${JSON.stringify(message)}\n`
            );
        }
    };

    run = (filePath: string) => {
        this.isRunning = true;
        this.view?.messageToOutput(commands.script.start(filePath));

        const fileExtension = path.extname(filePath);
        const command = fileExtension === ".js" ? "node" : "ts-node";
        this.fileName = path.basename(filePath);

        this.view?.messageToOutput(
            commands.log.log([
                { text: `[ ${this.fileName} ]`, styles: { color: "lightseagreen" } },
                ` ${command} "${filePath}"`,
            ])
        );

        let workDirectory = path.dirname(filePath);
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            workDirectory = workspaceFolders[0].uri.fsPath;
        }

        this.child = cp.spawn(command, [`"${filePath}"`], {
            cwd: workDirectory,
            shell: true,
        });

        this.child.stdout.on("data", this.onStdout);
        this.child.stderr.on("data", this.onStderr);
        this.child.on("exit", this.onExit);
    };

    private handleCommand = (line: string): boolean => {
        if (line.startsWith(commandLine)) {
            const command = line.substring(commandLine.length).trim();
            let commandObj: any = null;
            try {
                commandObj = JSON.parse(command);
            } catch (error) {
                this.view?.messageToOutput(
                    commands.log.error(`Error parsing command: ${error}`)
                );
                return false;
            }
            if (commandObj?.command) {
                if (isWindowGridCommand(commandObj)) {
                    handleWindowGridCommand(commandObj);
                } else if (isWindowTextCommand(commandObj)) {
                    handleWindowTextCommand(commandObj);
                } else {
                    this.view?.messageToOutput(commandObj);
                }
                return true;
            }
        }
        return false;
    };

    dispose = (): any => {
        this.isRunning = false;
        this.subscriptions.forEach((s) => s.unsubscribe());
        this.subscriptions = [];
        super.dispose();
    };
}
