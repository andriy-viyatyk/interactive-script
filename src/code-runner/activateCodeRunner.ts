import * as vscode from 'vscode';
import codeRunner from './CodeRunner';

export function activateCodeRunner(context: vscode.ExtensionContext) {
  const runTsFileDisposable = vscode.commands.registerCommand('avScriptTools.runScript', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No active editor.");
      return;
    }

    const filePath = editor.document.uri.fsPath;
    if (!(filePath.endsWith('.ts') || filePath.endsWith('.js'))) {
      vscode.window.showErrorMessage("Active file is not a TypeScript or JavaScript file.");
      return;
    }

    if (codeRunner.isRunning) {
      vscode.window.showErrorMessage("Script is already running.");
      return;
    }

    codeRunner.runFile(filePath);
  });

  const stopTsFileDisposable = vscode.commands.registerCommand('avScriptTools.stopScript', () => {
    if (codeRunner.isRunning) {
      codeRunner.stop();
    }
  });

  const clearConsoleDisposable = vscode.commands.registerCommand('avScriptTools.clearConsole', () => {
    codeRunner.clear();
  });

  context.subscriptions.push(runTsFileDisposable);
  context.subscriptions.push(stopTsFileDisposable);
  context.subscriptions.push(clearConsoleDisposable);
}
