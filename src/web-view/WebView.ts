import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { v4 } from "uuid";
import { Subscription } from "../utils/events";
import { GridColumn } from "../../shared/commands/grid";

export type WebViewType = "grid" | "output";

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
    panel: ViewPanel | undefined;
    type: WebViewType;
    context: vscode.ExtensionContext;
    onPanel = new Subscription<WebView>();

    constructor(context: vscode.ExtensionContext, type: WebViewType) {
        this.type = type;
        this.context = context;
    }

    resolveWebviewView(webviewView: vscode.WebviewView) {
        this.type = "output";
        this.panel = webviewView;
        this.panel.title = "Script UI";
        this.panel.webview.options = {
            enableScripts: true,
        };

        this.createPanelHtml(
            this.panel,
            `
                window.webViewType = "${this.type}";
            `
        );

        this.onPanel.send(this);
    }

    createGridPanel = (title: string, data: any, columns?: GridColumn[]) => {
        const panel = vscode.window.createWebviewPanel(
            "avScriptTools",
            title,
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
            }
        );
        this.panel = panel;

        panel.iconPath = vscode.Uri.file(
            path.join(this.context.extensionPath, "icons", "av.svg") // Path to your icon
        );

        const jsonStr = JSON.stringify(data).replace(/</g, "\\u003c");
        const columnsStr = columns ? JSON.stringify(columns).replace(/</g, "\\u003c") : undefined;

        this.createPanelHtml(
            panel,
            `
                window.jsonData = ${jsonStr};
                ${columnsStr ? `window.gridColumns = ${columnsStr};` : ""}
                window.webViewType = "${this.type}";
            `
        );

        this.onPanel.send(this);
    };

    private readonly createPanelHtml = (panel: ViewPanel, script: string) => {
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
                ${script}
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
