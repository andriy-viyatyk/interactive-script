import * as vscode from "vscode";
import * as path from "path";

import { BaseView } from "./BaseView";
import { WebViewInput } from "../../shared/types";
import { isGridEditorChangedCommand, isGridEditorCommand } from "../../shared_internal/grid-editor-commands";
import { ViewMessage } from "../../shared/ViewMessage";
import { gridContentProvider } from "./GridContentProvider";

export class GridView extends BaseView implements vscode.CustomTextEditorProvider {
    private document: vscode.TextDocument | undefined;

    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        token: vscode.CancellationToken
    ): Promise<void> {
        this.document = document;
        const fileExtension = path.extname(document.uri.fsPath).toLowerCase();
        const isCsv = fileExtension === ".csv";
        this.type = isCsv ? "grid" : "json";

        this.panel = webviewPanel;
        this.panel.title = document.fileName;
        this.panel.webview.options = {
            enableScripts: true,
        };

        let data: any = document.getText();
        if (!isCsv) {
            try {
                data = JSON.parse(data);
            } catch (e) {
                console.error("Error parsing JSON for custom editor:", e);
                vscode.window.showErrorMessage(
                    `Invalid JSON in ${document.fileName}. Please check the file.`
                );
                return;
            }
        }

        const webViewInput: WebViewInput = {
            viewType: this.type,
            gridInput: {
                jsonData: isCsv ? undefined : data,
                csvData: isCsv ? data : undefined,
                gridColumns: undefined,
                gridTitle: document.fileName,
            },
        }
        this.createPanelHtml(this.panel, webViewInput);

        this.panelCreated();
    }

    handleMessage = async (message: ViewMessage<any, string>) => {
        if (isGridEditorCommand(message)) {
            
            if (isGridEditorChangedCommand(message) && message.data) {
                this.updateDocumentContent(message.data.content ?? "");
            }

            return;
        }

        BaseView.prototype.handleMessage.call(this, message as ViewMessage<any>);
    }

    private async updateDocumentContent(newContent: string) {
        if (!this.document) {
            return;
        }

        if (this.document.uri.scheme === 'interactive-script-grid') {
            gridContentProvider.setContent(this.document.uri, newContent);
        } else {
            const edit = new vscode.WorkspaceEdit();
            edit.replace(
                this.document.uri,
                new vscode.Range(0, 0, this.document.lineCount, this.document.lineAt(this.document.lineCount - 1).text.length),
                newContent
            );
            await vscode.workspace.applyEdit(edit);
        }
    }
}