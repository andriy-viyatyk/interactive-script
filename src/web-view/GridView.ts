import * as vscode from "vscode";
import * as path from "path";

import { BaseView } from "./BaseView";
import { WebViewInput } from "../../shared/types";
import { gridEditorChangedCommand, isGridEditorChangedCommand, isGridEditorCommand } from "../../shared_internal/grid-editor-commands";
import { ViewMessage } from "../../shared/ViewMessage";

export class GridView extends BaseView implements vscode.CustomTextEditorProvider {
    private document: vscode.TextDocument | undefined;
    private isCsv = false;
    private skipDocumentChange = false;

    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        token: vscode.CancellationToken
    ): Promise<void> {
        this.document = document;
        const fileExtension = path.extname(document.uri.fsPath).toLowerCase();
        this.isCsv = fileExtension === ".csv";
        this.type = this.isCsv ? "grid" : "json";

        this.panel = webviewPanel;
        this.panel.title = document.fileName;
        this.panel.webview.options = {
            enableScripts: true,
        };

        const data = this.getDocumentData(document);

        const webViewInput: WebViewInput = {
            viewType: this.type,
            gridInput: {
                jsonData: this.isCsv ? undefined : data,
                csvData: this.isCsv ? data : undefined,
                gridColumns: undefined,
                gridTitle: document.fileName,
            },
        }
        this.createPanelHtml(this.panel, webViewInput);

        this.panelCreated();

        const changeSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === this.document?.uri.toString()) {
                this.documentChanged(e.document);
            }
        });
        this.disposables.push(changeSubscription);
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

    private documentChanged = (document: vscode.TextDocument) => {
        if (this.skipDocumentChange) {
            this.skipDocumentChange = false;
            return;
        }
        const content = document.getText();
        this.messageToOutput(gridEditorChangedCommand({ content }));
    }

    private getDocumentData = (document: vscode.TextDocument) => {
        let data: any = document.getText();
        if (!this.isCsv) {
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
        return data;
    }

    private async updateDocumentContent(newContent: string) {
        if (!this.document) {
            return;
        }

        this.skipDocumentChange = true;
        const edit = new vscode.WorkspaceEdit();
        edit.replace(
            this.document.uri,
            new vscode.Range(0, 0, this.document.lineCount, this.document.lineAt(this.document.lineCount - 1).text.length),
            newContent
        );
        await vscode.workspace.applyEdit(edit);
    }
}