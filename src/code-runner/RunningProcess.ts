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
} from "../../shared/commands/window";
import { uiTextToString, ViewMessage } from "../../shared/ViewMessage";
import { SubscriptionObject } from "../utils/events";
import { isScriptStopCommand } from "../../shared/commands/script";
import { handleFileOpenCommand, handleFileOpenFolderCommand, handleFileSaveCommand, handleWindowGridCommand, handleWindowTextCommand, showOpenDialog } from "../utils/common-commands";
import { isOnConsoleCommand, isOnConsoleLogCommand, OnConsoleCommand } from "../../shared/commands/on-console";
import { isOutputClearCommand, isOutputCommand } from "../../shared/commands/output";
import { clearOutput, writeOutput } from "../utils/output-channel";
import { getPythonPath } from "../utils/python-utils";
import { WorkingDirectoryType } from "../types";
import { isFileOpenCommand } from "../../shared/commands/file-open";
import { isFileSaveCommand } from "../../shared/commands/file-save";
import { isFileOpenFolderCommand } from "../../shared/commands/file-openFolder";

export class RunningProcess extends vscode.Disposable {
    private child: cp.ChildProcessWithoutNullStreams | null = null;
    private fileName: string = "";
    private view?: WebView;
    private viewIsBottomPanel = false;
    private subscriptions: SubscriptionObject[] = [];
    private onConsoleLog: OnConsoleCommand | undefined;
    private onConsoleError: OnConsoleCommand | undefined;
    private unprocessedLine: string = '';

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

        if (this.onConsoleLog) {
            const message = {...this.onConsoleLog, data: line };
            this.sendToProcess(message);
            return;
        }

        this.view?.messageToOutput(commands.log.log(line));
    };

    private onError = (error: string) => {
        if (this.onConsoleError) {
            const message = {...this.onConsoleError, data: error };
            this.sendToProcess(message);
            return;
        }

        this.view?.messageToOutput(commands.log.error(error));
    };

    private onStdout = (data: Buffer) => {
        if (!this.isRunning) return;
        let text = data.toString();
        if (this.unprocessedLine) {
            text = this.unprocessedLine + text;
            this.unprocessedLine = '';
        }
        const lines = text.split("\n");
        if (lines.length && lines[lines.length - 1] === "") {
            lines.pop();
        }
        const normalizedLines = this.normalizeCommandLines(lines);
        normalizedLines.forEach(this.onLine);
    };

    private normalizeCommandLines = (lines: string[]) => {
        const resultLines: string[] = [];
        let currentLine = '';
        while (lines.length) {
            currentLine += lines.shift() || '';
            if (currentLine.startsWith(commandLine)) {
                const command = currentLine.substring(commandLine.length).trim();
                let commandValid = command.endsWith("}");
                if (commandValid) {
                    try {
                        JSON.parse(command);
                        commandValid = true;
                    } catch {
                        commandValid = false;
                    }
                }
                if (commandValid) {
                    resultLines.push(currentLine);
                    currentLine = '';
                }
            } else {
                resultLines.push(currentLine);
                currentLine = '';
            }
        }
        if (currentLine) {
            this.unprocessedLine += currentLine;
        }
        return resultLines;
    }

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

    private sendToProcess = (message: ViewMessage<any>) => {
        if (this.child) {
            const line = `${commandLine}${JSON.stringify(message)}\n`;
            this.child.stdin.write(line);
        }
    }

    private onWebViewMessage = (message?: ViewMessage<any>) => {
        if (message?.command) {
            if (isScriptStopCommand(message)) {
                this.stop();
                return;
            }

            this.sendToProcess(message);
        }
    };

    run = async (filePath: string) => {
        this.isRunning = true;
        this.view?.messageToOutput(commands.script.start(filePath));

        const config = vscode.workspace.getConfiguration('interactiveScript');

        const fileExtension = path.extname(filePath);
        let command = "node";
        let args: string[] = [];

        if (fileExtension === ".ts") {
            command = "ts-node";
            args = config.get<string[]>('tsNodeArgs', []);
        } else if (fileExtension == ".py") {
            command = await getPythonPath();
            args = config.get<string[]>('pythonArgs', []);
        } else if (fileExtension === ".js") {
            command = "node";
            args = config.get<string[]>('nodeArgs', []);
        }
        
        const workingDirectoryOption = config.get<WorkingDirectoryType>('workingDirectory');

        let workDirectory = path.dirname(filePath);
        if (workingDirectoryOption !== "file") {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (workspaceFolders && workspaceFolders.length > 0) {
                workDirectory = workspaceFolders[0].uri.fsPath;
            }
        }

        args.push(filePath);
        this.fileName = path.basename(filePath);
        this.view?.messageToOutput(
            commands.log.log([
                { text: `[ ${this.fileName} ]`, styles: { color: "lightseagreen" } },
                ` "${command}"${args.map(arg => ` "${arg}"`)}`,
            ])
        );

        this.child = cp.spawn(`"${command}"`, args.map(arg => `"${arg}"`), {
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
                    commands.log.error(`RunningProcess: Error parsing command: ${error}`)
                );
                return false;
            }
            if (commandObj?.command) {
                if (isWindowGridCommand(commandObj)) {
                    handleWindowGridCommand(commandObj);
                } else if (isWindowTextCommand(commandObj)) {
                    handleWindowTextCommand(commandObj);
                } else if (isOnConsoleCommand(commandObj)) {
                    if (isOnConsoleLogCommand(commandObj)) {
                        this.onConsoleLog = commandObj;
                    } else {
                        this.onConsoleError = commandObj;
                    }
                } else if (isOutputCommand(commandObj)) {
                    writeOutput(commandObj.data ?? "");
                } else if (isOutputClearCommand(commandObj)) {
                    clearOutput();
                } else if (isFileOpenCommand(commandObj)) {
                    handleFileOpenCommand(commandObj, (replayCommand) => {
                        this.sendToProcess(replayCommand);
                    });
                } else if (isFileSaveCommand(commandObj)) {
                    handleFileSaveCommand(commandObj, (replayCommand) => {
                        this.sendToProcess(replayCommand);
                    });
                } else if (isFileOpenFolderCommand(commandObj)) {
                    handleFileOpenFolderCommand(commandObj, (replayCommand) => {
                        this.sendToProcess(replayCommand);
                    });
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
