import * as vscode from "vscode";
import * as path from "path";

import { BaseView } from "./BaseView";
import { WebViewInput } from "../../shared/types";
import { gridEditorChangedCommand, GridEditorSaveAsData, isGridEditorChangedCommand, isGridEditorCommand, isGridEditorSaveAsCommand } from "../../shared_internal/grid-editor-commands";
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
            } else if (isGridEditorSaveAsCommand(message) && message.data) {
                this.saveAs(message.data);
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

    private async saveAs(data: GridEditorSaveAsData) {
        const { content, format } = data;
        const filters: { [name: string]: string[]; } = format === "json"
            ? { "JSON Files": ["json"] }
            : { "CSV Files": ["csv"] };

        let defaultUri = this.document ? this.document.uri : undefined;
        if (defaultUri) {
            const ext = format === "json" ? ".json" : ".csv";
            const baseName = path.basename(defaultUri.fsPath, path.extname(defaultUri.fsPath));
            const newPath = path.join(path.dirname(defaultUri.fsPath), `${baseName}${ext}`);
            defaultUri = vscode.Uri.file(newPath);
        }

        const uri = await vscode.window.showSaveDialog({
            filters,
            defaultUri,
            saveLabel: "Save As",
        });

        if (!uri) {
            return;
        }

        const writeData = Buffer.from(content, "utf8");
        await vscode.workspace.fs.writeFile(uri, writeData);
        vscode.window.showInformationMessage(`File saved as ${uri.fsPath}`);
    }
}