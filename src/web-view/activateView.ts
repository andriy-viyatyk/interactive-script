import * as vscode from 'vscode';
import * as fs from "fs";
import * as path from "path";
import views from './Views';
import { json } from 'stream/consumers';

export function activateView(context: vscode.ExtensionContext) {
    const disposeGridView = vscode.commands.registerCommand(
        "avScriptTools.showGrid",
        () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage("No active editor.");
                return;
            }

            const filePath = editor.document.uri.fsPath;
            const fileName = path.basename(filePath);
            const fileExtension = path.extname(filePath).toLowerCase();
            const jsonOrCsv = fs.readFileSync(filePath, "utf-8");

            let data = jsonOrCsv;
            let isCsv = true;
            if (fileExtension === ".json") {
                try {
                    data = JSON.parse(jsonOrCsv);
                    isCsv = false;
                } catch (e) {
                    console.error("Error parsing JSON:", e);
                    vscode.window.showErrorMessage(
                        "Invalid JSON file. Please check the console for details."
                    );
                    return;
                }
            }

            const gridView = views.createView(context, "grid");
            gridView.createGridPanel(fileName, data, undefined, isCsv);
        }
    );

    // Register the webview view provider for the bottom panel
    const outputView = views.createView(context, "output");
    const disposeOutputView = vscode.window.registerWebviewViewProvider(
        "avScriptTools.bottomPanel",
        outputView,
        {
            webviewOptions: { retainContextWhenHidden: true },
        }
    );

    context.subscriptions.push(disposeGridView);
    context.subscriptions.push(disposeOutputView);
}