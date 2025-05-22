import * as vscode from "vscode";
import codeRunner from "./CodeRunner";

export function activateCodeRunner(context: vscode.ExtensionContext) {
    const getActiveScriptFile = () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("No active editor.");
            return;
        }

        const filePath = editor.document.uri.fsPath;
        if (!(filePath.endsWith(".ts") || filePath.endsWith(".js") || filePath.endsWith(".py"))) {
            vscode.window.showErrorMessage(
                "Active file is not a TypeScript, JavaScript or Python file."
            );
            return;
        }

        return filePath;
    }

    const runTsFileDisposable = vscode.commands.registerCommand(
        "interactiveScript.runScript",
        () => {
            const filePath = getActiveScriptFile();
            if (filePath) {
                codeRunner.runFile(filePath);
            }
        }
    );

    const runTsFileSeparateDisposable = vscode.commands.registerCommand(
        "interactiveScript.runScriptSeparate",
        () => {
            const filePath = getActiveScriptFile();
            if (filePath) {
                codeRunner.runFile(filePath, true);
            }
        }
    );

    const stopTsFileDisposable = vscode.commands.registerCommand(
        "interactiveScript.stopScript",
        () => {
            codeRunner.stop();
        }
    );

    const clearConsoleDisposable = vscode.commands.registerCommand(
        "interactiveScript.clearConsole",
        () => {
            codeRunner.clear();
        }
    );

    context.subscriptions.push(runTsFileDisposable);
    context.subscriptions.push(runTsFileSeparateDisposable);
    context.subscriptions.push(stopTsFileDisposable);
    context.subscriptions.push(clearConsoleDisposable);
}
