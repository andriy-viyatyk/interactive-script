import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { v4 } from "uuid";

import { WebViewInput, WebViewType } from "../../shared/types";
import { Subscription } from "../utils/events";
import { UiText, uiTextToString, ViewMessage } from "../../shared/ViewMessage";
import { isViewReadyCommand } from "../../shared/commands/view-ready";
import { isScriptStartCommand } from "../../shared/commands/script";
import {
    isWindowGridCommand,
    isWindowTextCommand,
} from "../../shared/commands/window";
import {
    handleFileExistsCommand,
    handleFileOpenCommand,
    handleFileOpenFolderCommand,
    handleFileSaveCommand,
    handleWindowGridCommand,
    handleWindowTextCommand,
} from "../utils/common-commands";
import { isFileOpenCommand } from "../../shared/commands/file-open";
import { isFileOpenFolderCommand } from "../../shared/commands/file-openFolder";
import { isFileSaveCommand } from "../../shared/commands/file-save";
import { isFileExistsCommand } from "../../shared/commands/file-exists";

export interface ViewPanel {
    viewType: string;
    title?: string;
    webview: vscode.Webview;
    visible: boolean;
    onDidDispose: vscode.Event<void>;

    // only for Tool Panel
    dispose?: () => void;

    // only for Page Panel
    reveal?: (viewColumn?: vscode.ViewColumn, preserveFocus?: boolean) => void;
}

export class BaseView {
    context: vscode.ExtensionContext;
    type: WebViewType;
    id: string = v4();
    panel: ViewPanel | undefined;
    isBottomPanel = false;

    onPanel = new Subscription<BaseView>();
    onOutputMessage = new Subscription<ViewMessage<any>>();
    onDispose = new Subscription<void>();
    readonly disposables: vscode.Disposable[] = [];
    disposed = false;

    protected onReady: (() => void) | undefined;
    whenReady = new Promise<void>((resolve) => {
        this.onReady = resolve;
    });

    constructor(context: vscode.ExtensionContext, type: WebViewType) {
        this.type = type;
        this.context = context;
        const view = this;
        Promise.resolve().then(() => {
            Views.viewCreated(view);
        });
    }

    messageToOutput = (message: ViewMessage<any, string>) => {
        this.panel?.webview.postMessage(message);
    };

    handleMessage = async (message: ViewMessage<any>) => {
        if (message?.command) {
            if (isViewReadyCommand(message)) {
                this.onReady?.();
                this.onReady = undefined;
                return;
            }

            if (isScriptStartCommand(message)) {
                if (message.data) {
                    const codeRunner = (
                        await import("../code-runner/CodeRunner")
                    ).default;
                    codeRunner.runProcessWithView(message.data, this);
                }
                return;
            }

            if (isWindowGridCommand(message)) {
                handleWindowGridCommand(message);
                return;
            }

            if (isWindowTextCommand(message)) {
                handleWindowTextCommand(message);
                return;
            }

            if (isFileOpenCommand(message)) {
                handleFileOpenCommand(message, (replayMessage) => {
                    this.messageToOutput(replayMessage);
                });
                return;
            }

            if (isFileOpenFolderCommand(message)) {
                handleFileOpenFolderCommand(message, (replayMessage) => {
                    this.messageToOutput(replayMessage);
                });
                return;
            }

            if (isFileSaveCommand(message)) {
                handleFileSaveCommand(message, (replayMessage) => {
                    this.messageToOutput(replayMessage);
                });
                return;
            }

            if (isFileExistsCommand(message)) {
                handleFileExistsCommand(message, (replayMessage) => {
                    this.messageToOutput(replayMessage);
                });
                return;
            }

            this.onOutputMessage.send(message);
        }
    };

    protected panelCreated = () => {
        const subscriptions: vscode.Disposable[] = [];
        const messageSubscription = this.panel?.webview.onDidReceiveMessage(
            this.handleMessage
        );
        if (messageSubscription) {
            subscriptions.push(messageSubscription);
        }

        const disposeSubscription = this.panel?.onDidDispose(() => {
            subscriptions.forEach((s) => s.dispose());
            this.dispose();
        });
        if (disposeSubscription) {
            subscriptions.push(disposeSubscription);
        }

        this.onPanel.send(this);
    };

    protected createPanel = (
        title: UiText,
        iconPath: vscode.Uri,
        webViewInput: WebViewInput,
        column: vscode.ViewColumn
    ) => {
        const panel = vscode.window.createWebviewPanel(
            "interactiveScript",
            uiTextToString(title),
            column,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.file(
                        path.join(this.context.extensionUri.fsPath, "media")
                    ),
                ],
            }
        );
        this.panel = panel;
        panel.iconPath = iconPath;
        this.createPanelHtml(panel, webViewInput);

        this.panelCreated();
        return panel;
    };

    protected readonly createPanelHtml = (
        panel: ViewPanel,
        webViewInput: WebViewInput
    ) => {
        const jsonStr = JSON.stringify(webViewInput).replace(/</g, "\\u003c");

        // Path to the manifest.json
        const manifestPath = path.join(
            this.context.extensionUri.fsPath,
            "media",
            ".vite",
            "manifest.json"
        );

        // Read the manifest file
        const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

        const mediaBaseUri = panel.webview.asWebviewUri(
            vscode.Uri.file(
                path.join(this.context.extensionUri.fsPath, "media")
            )
        );
        const scriptFileName = manifest["index.html"].file;
        const styleFileName = manifest["index.html"].css[0];

        panel.webview.html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>JSON Grid</title>
              <base href="${mediaBaseUri.toString()}/">
              <link href="${styleFileName}" rel="stylesheet">
              <script>
                window.appInput = ${jsonStr};
              </script>
            </head>
            <body>
              <div id="root"></div>
              <script type="module" src="${scriptFileName}"></script>
            </body>
            </html>
          `;
    };

    private dispose() {
        if (this.disposed) return;

        this.disposables.forEach(d => d.dispose());
        this.disposables.splice(0);
        this.disposed = true;
        this.onDispose.send();
    }
}

export class Views {
    static views: Map<string, BaseView> = new Map<string, BaseView>();
    static output: BaseView | undefined = undefined;

    static viewCreated = (view?: BaseView) => {
        if (!view) {
            return;
        }

        if (view.panel) {
            this.onPanel(view);
        } else {
            view.onPanel.subscribe(this.onPanel);
        }
    };

    private static readonly onPanel = (view?: BaseView) => {
        if (!view) {
            return;
        }
        this.setupView(view);
        this.views.set(view.id, view);
    }

    private static readonly setupView = (view: BaseView) => {
        if (view.isBottomPanel) {
            this.output = view;
        }

        view.onDispose.subscribe(() => {
            this.views.delete(view.id);
            if (view === this.output) {
                this.output = undefined;
            }
        });
    }
}
