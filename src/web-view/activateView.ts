import * as vscode from 'vscode';

import { GridView } from './GridView';
import { OutputView } from './OutputView';

export function activateView(context: vscode.ExtensionContext) {
    const disposeGridView = vscode.commands.registerCommand(
        "interactiveScript.showGrid",
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage("No active editor.");
                return;
            }

            const documentUri = editor.document.uri;

            try {
                await vscode.commands.executeCommand(
                    "vscode.openWith",
                    documentUri,
                    "interactiveScript.gridEditor",
                    {
                        viewColumn: editor.viewColumn,
                        preserveFocus: false,
                    }
                );
            } catch (e: any) {
                vscode.window.showErrorMessage(`Failed to open file with Grid Editor: ${e?.message}`);
                console.error("Error opening file with custom editor:", e);
            }
        }
    );

    // Register the webview view provider for the bottom panel
    const outputView = new OutputView(context, "output");
    outputView.isBottomPanel = true;
    const disposeOutputView = vscode.window.registerWebviewViewProvider(
        "interactiveScript.bottomPanel",
        outputView,
        {
            webviewOptions: { retainContextWhenHidden: true },
        }
    );

    // Register the custom text editor provider for the grid view
    const gridDocumetProvider = {
        resolveCustomTextEditor(
            document: vscode.TextDocument,
            webviewPanel: vscode.WebviewPanel,
            token: vscode.CancellationToken) {
            const gridView = new GridView(context, "json");
            gridView.resolveCustomTextEditor(document, webviewPanel, token)
        }
    };
    const disposeGridDocumentProvider = vscode.window.registerCustomEditorProvider(
        "interactiveScript.gridEditor",
        gridDocumetProvider,
        {
            webviewOptions: {
                retainContextWhenHidden: true // Keep editor state when hidden
            },
            supportsMultipleEditorsPerDocument: true // Allow multiple instances of the same document
        }
    )

    context.subscriptions.push(disposeGridView);
    context.subscriptions.push(disposeOutputView);
    context.subscriptions.push(disposeGridDocumentProvider);
}