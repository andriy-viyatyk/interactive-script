import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { v4 } from "uuid";
import { Subscription } from "../utils/events";
import { GridColumn } from "../../shared/commands/output-grid";
import { WebViewInput, WebViewType } from "../../shared/types";
import { UiText, uiTextToString, ViewMessage } from "../../shared/ViewMessage";
import { isViewReadyCommand } from "../../shared/commands/view-ready";
import { isScriptStartCommand } from "../../shared/commands/script";
import codeRunner from "../code-runner/CodeRunner";
import { isWindowGridCommand, isWindowTextCommand } from "../../shared/commands/window";
import { handleWindowGridCommand, handleWindowTextCommand } from "../utils/common-commands";

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

export class WebView implements vscode.WebviewViewProvider {
    id: string = v4();
    private panel: ViewPanel | undefined;
    type: WebViewType;
    context: vscode.ExtensionContext;
    onPanel = new Subscription<WebView>();
    isBottomPanel = false;
    onOutputMessage = new Subscription<ViewMessage<any>>();
    onDispose = new Subscription<void>();
    private onReady: (() => void) | undefined;
    whenReady = new Promise<void>(resolve => {
        this.onReady = resolve;
    });

    constructor(context: vscode.ExtensionContext, type: WebViewType) {
        this.type = type;
        this.context = context;
    }

    messageToOutput = (message: ViewMessage<any>) => {
        this.panel?.webview.postMessage(message);
    }

    private handleMessage = (message: ViewMessage<any>) => {
        if (message?.command) {
            if (isViewReadyCommand(message)) {
                this.onReady?.();
                this.onReady = undefined;
                return;
            }

            if (isScriptStartCommand(message)) {
                if (message.data) {
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

            this.onOutputMessage.send(message);
        }
    }

    private panelCreated = () => {
        const subscriptions: vscode.Disposable[] = [];
        const messageSubscription =  this.panel?.webview.onDidReceiveMessage(this.handleMessage);
        if (messageSubscription) {
            subscriptions.push(messageSubscription);
        }

        const disposeSubscription = this.panel?.onDidDispose(() => {
           subscriptions.forEach((s) => s.dispose());
           this.onDispose.send();
        });
        if (disposeSubscription) {
            subscriptions.push(disposeSubscription);
        }

        this.onPanel.send(this);
    }

    resolveWebviewView(webviewView: vscode.WebviewView) {
        this.type = "output";
        this.isBottomPanel = true;
        this.panel = webviewView;
        this.panel.title = "Script UI";
        this.panel.webview.options = {
            enableScripts: true,
        };

        const webViewInput: WebViewInput = {
            viewType: this.type,
        };
        this.createPanelHtml(this.panel, webViewInput);

        this.panelCreated();
    }

    private createPanel = (title: UiText, iconPath: vscode.Uri, webViewInput: WebViewInput, column: vscode.ViewColumn) => {
        const panel = vscode.window.createWebviewPanel(
            "avScriptTools",
            uiTextToString(title),
            column,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
            }
        );
        this.panel = panel;
        panel.iconPath = iconPath;
        this.createPanelHtml(panel, webViewInput);

        this.panelCreated();
        return panel;
    }

    createGridPanel = (title: UiText, data: any, columns?: GridColumn[], isCsv?: boolean) => {
        this.type = "grid";
        this.createPanel(
            title,
                vscode.Uri.file(
                path.join(this.context.extensionPath, "icons", "av.svg") // Path to your icon
            ),
            {
                viewType: "grid",
                gridInput: {
                    jsonData: isCsv ? undefined :data,
                    csvData: isCsv ? data : undefined,
                    gridColumns: columns,
                    gridTitle: title,
                },
            },
            vscode.ViewColumn.One
        );
    };

    createOutputPanel = (filePath: string) => {
        const fileName = path.basename(filePath);

        this.type = "output";
        this.createPanel(
            `[ ${fileName} ]`,
            vscode.Uri.file(
                path.join(this.context.extensionPath, "icons", "arrowRight.svg") // Path to your icon
            ),
            {
                viewType: "output",
                outputInput: {
                    withHeader: true,
                    title: fileName,
                    filePath: filePath,
                },
            },
            vscode.ViewColumn.Two
        );
    }

    private readonly createPanelHtml = (
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

        const scriptUri = panel.webview.asWebviewUri(
            vscode.Uri.file(
                path.join(
                    this.context.extensionUri.fsPath,
                    "media",
                    manifest["index.html"].file
                )
            )
        );
        const styleUri = panel.webview.asWebviewUri(
            vscode.Uri.file(
                path.join(
                    this.context.extensionUri.fsPath,
                    "media",
                    manifest["index.html"].css[0]
                )
            )
        );

        panel.webview.html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>JSON Grid</title>
              <link href="${styleUri}" rel="stylesheet">
              <script>
                window.appInput = ${jsonStr};
              </script>
            </head>
            <body>
              <div id="root"></div>
              <script type="module" src="${scriptUri}"></script>
            </body>
            </html>
          `;
    };
}
