import * as vscode from "vscode";
import { PythonPathSource } from "../types";

export async function getPythonPath() {
    const config = vscode.workspace.getConfiguration('interactiveScript');
    const pythonPathSource = config.get<PythonPathSource>('pythonPathSource');
    const manualPythonPath = config.get<string>('manualPythonPath');
    const manualPath = manualPythonPath || "python"; // fallback

    if (pythonPathSource === "manual") {
        return manualPath;
    }

    const pythonExtension = vscode.extensions.getExtension("ms-python.python");
    if (!pythonExtension) {
        return manualPath;
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
        return manualPath;
    }
}
