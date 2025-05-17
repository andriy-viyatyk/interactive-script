import * as vscode from "vscode";

export async function getPythonPath() {
    const pythonExtension = vscode.extensions.getExtension("ms-python.python");
    if (!pythonExtension) {
        return "python"; // fallback
    }
    if (!pythonExtension.isActive) {
        await pythonExtension.activate();
    }
    try {
        const api = pythonExtension.exports;
        const pythonPath = api.settings.getExecutionDetails().execCommand[0];
        return pythonPath;
    } catch (error) {
        console.error("Error getting Python path:", error);
        return "python"; // fallback
    }
}
