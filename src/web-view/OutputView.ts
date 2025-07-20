import * as vscode from "vscode";
import * as path from "path";

import { BaseView } from "./BaseView";
import { WebViewInput } from "../../shared/types";

export class OutputView extends BaseView implements vscode.WebviewViewProvider {
    resolveWebviewView(webviewView: vscode.WebviewView | vscode.WebviewPanel): void {
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

    createOutputPanel = (filePath: string) => {
        const fileName = path.basename(filePath);

        this.createPanel(
            `[ ${fileName} ]`,
            vscode.Uri.file(
                path.join(this.context.extensionPath, "icons", "arrowRight.svg") // Path to your icon
            ),
            {
                viewType: this.type,
                outputInput: {
                    withHeader: true,
                    title: fileName,
                    filePath: filePath,
                },
            },
            vscode.ViewColumn.Two
        );
    };
}