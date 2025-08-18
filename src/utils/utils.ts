import * as vscode from 'vscode';

let checkEditorAssociationsShown = 0;
export async function checkEditorAssociations() {
    checkEditorAssociationsShown++;
    if (checkEditorAssociationsShown > 3) {
        return;
    }
    
    const config = vscode.workspace.getConfiguration('workbench');

    const associations = config.get<{ [key: string]: string }>('editorAssociations');

    if (associations && associations['*.json'] === 'default') {
        const message = "A default editor is configured for all .json files, which may conflict with 'Interactive Script' editor for *.grid.json files. Please consider removing the \"workbench.editorAssociations\" setting for *.json.";
        const openSettingsButton = 'Open Settings';

        const selection = await vscode.window.showWarningMessage(message, openSettingsButton);
        if (selection === openSettingsButton) {
            vscode.commands.executeCommand('workbench.action.openSettingsJson');
        }
    }
}