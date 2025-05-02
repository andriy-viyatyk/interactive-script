import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';
import views from "../web-view/Views";
import { contextScriptRunning } from '../constants';
import { commandLine } from '../../shared/constants';
import commands from '../../shared/commands';
import { ViewMessage } from '../../shared/ViewMessage';
import { isWindowGridCommand, isWindowTextCommand, WindowGridCommand, WindowTextCommand } from '../../shared/commands/window';
import vars from '../vars';

class CodeRunner {
    private _isRunning: boolean = false;
    private child: cp.ChildProcessWithoutNullStreams | null = null;
    private viewsSubscribed = false;

    get isRunning() {
        return this._isRunning;
    }

    set isRunning(value: boolean) {
        this._isRunning = value;
        vscode.commands.executeCommand(
            "setContext",
            contextScriptRunning,
            value
        );

        if (this.child) {
            this.child.kill("SIGINT");
            this.child = null;
        }
    }

    handleCommand = (line: string): boolean => {
        if (line.startsWith(commandLine)) {
            const command = line.substring(commandLine.length).trim();
            let commandObj: any = null;
            try {
                commandObj = JSON.parse(command);
            }
            catch (error) {
                views.messageToOutput(
                    commands.log.error(`Error parsing command: ${error}`)
                );
                return false;
            }
            if (commandObj?.command) {
                if (isWindowGridCommand(commandObj)) {
                    this.handleWindowGridCommand(commandObj);
                } else if (isWindowTextCommand(commandObj)) {
                    this.handleWindowTextCommand(commandObj);
                } else {
                    views.messageToOutput(commandObj);
                }
                return true;
            }
        }
        return false;
    }

    onReplayMessage = (message?: ViewMessage) => {
        if (!message) return;

        if (isWindowGridCommand(message)) {
            this.handleWindowGridCommand(message);
            return;
        }

        if (isWindowTextCommand(message)) {
            this.handleWindowTextCommand(message);
            return;
        }

        if (!this.child) return;

        this.child.stdin.write(
            `${commandLine}${JSON.stringify(message)}\n`
        );
    }

    handleProcess = (child: cp.ChildProcessWithoutNullStreams) => {
        if (!this.viewsSubscribed) {
            views.onOutputMessage.subscribe(this.onReplayMessage);
            this.viewsSubscribed = true;
        }

        const isLive = () => child === this.child;

        const onLine = (line: string) => {
            if (this.handleCommand(line)) return;

            views.messageToOutput(commands.log.log(line));

            // Check if the script printed "ping"
            if (line === "ping") {
                this.child?.stdin.write("pong\n");
            }
        };

        const onError = (error: string) => {
            views.messageToOutput(commands.log.error(error));
        }

        child.stdout.on("data", (data: Buffer) => {
            if (!isLive()) return;
            const text = data.toString();
            const lines = text.split("\n");
            if (lines.length && lines[lines.length - 1] === "") {
                lines.pop();
              }
            lines.forEach(onLine);
        });

        child.stderr.on("data", (data: Buffer) => {
            if (!isLive()) return;
            const text = data.toString();
            const lines = text.trim().split("\n");
            if (lines.length && lines[lines.length - 1] === "") {
                lines.pop();
              }
            lines.forEach(onError);
        });

        child.on("exit", (code) => {
            if (!isLive()) return;
            views.messageToOutput(
                commands.log.info(`Script exited with code ${code}`)
            );
            this.child = null;
            this.isRunning = false;
        });
    }

    runFile = (filePath: string) => {
        this.isRunning = true;

        const fileExtension = path.extname(filePath);
        const command = fileExtension === ".js" ? "node" : "ts-node";

        views.messageToOutput(
            commands.log.info(
                `> ${command} "${filePath}"`
            )
        );

        this.child = cp.spawn(command, [`"${filePath}"`], {
            cwd: path.dirname(filePath),
            shell: true,
        });

        this.handleProcess(this.child);
    };

    stop = () => {
        if (this.child) {
            this.child.kill("SIGKILL");
        }
    }

    clear = () => {
        views.messageToOutput(commands.clear());
    }

    private readonly handleWindowGridCommand = (message: WindowGridCommand) => {
        if (vars.extensionContext) {
            const view = views.createView(vars.extensionContext, "grid")
            view.createGridPanel(message.data?.title ?? "Data", message.data?.data ?? [], message.data?.columns);
        }
    }

    private readonly handleWindowTextCommand = async (message: WindowTextCommand) => {
        if (vars.extensionContext) {
            const document = await vscode.workspace.openTextDocument({
                content: message.data?.text ?? "",
                language: message.data?.language ?? 'plaintext',
            });

            await vscode.window.showTextDocument(document, { preview: true });
        }
    }
}

const codeRunner = new CodeRunner();

export default codeRunner;
