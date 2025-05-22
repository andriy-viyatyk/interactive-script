import * as vscode from "vscode";

export function activateOtherCommands(context: vscode.ExtensionContext) {
    let openSettingsDisposable = vscode.commands.registerCommand('interactiveScript.openSettings', () => {
        const extensionId = context.extension.id; // Get your own extension ID dynamically

        // Open settings and search for settings contributed by your extension
        vscode.commands.executeCommand(
            'workbench.action.openSettings',
            `@ext:${extensionId}`
        );
    });

    context.subscriptions.push(openSettingsDisposable);
}