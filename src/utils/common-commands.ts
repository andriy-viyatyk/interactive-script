import * as vscode from "vscode";
import * as fs from "fs";
import {
    WindowGridCommand,
    WindowTextCommand,
} from "../../shared/commands/window";
import vars from "../vars";
import views from "../web-view/Views";
import { uiTextToString } from "../../shared/ViewMessage";
import { FileOpenCommand } from "../../shared/commands/file-open";
import { FileSaveCommand } from "../../shared/commands/file-save";
import { FileOpenFolderCommand } from "../../shared/commands/file-openFolder";
import { FileExistsCommand } from "../../shared/commands/file-exists";
import path from "path";

export const handleWindowGridCommand = (message: WindowGridCommand) => {
    setTimeout(() => {
        if (vars.extensionContext) {
            const view = views.createView(vars.extensionContext, "grid");
            view.createGridPanel(
                message.data?.title ?? "Data",
                message.data?.data ?? [],
                message.data?.columns
            );
        }
    }, 0);
};

export const handleWindowTextCommand = async (message: WindowTextCommand) => {
    if (vars.extensionContext) {
        const document = await vscode.workspace.openTextDocument({
            content: message.data?.text ?? "",
            language: message.data?.language ?? "plaintext",
        });

        await vscode.window.showTextDocument(document, { preview: true });
    }
};

export const showOpenDialog = async (
    options: vscode.OpenDialogOptions
) => {
    if (vars.extensionContext) {
        const result = await vscode.window.showOpenDialog(options);
        return result;
    }
};

export const saveFileDialog = async (
    options: vscode.SaveDialogOptions
) => {
    if (vars.extensionContext) {
        const result = await vscode.window.showSaveDialog(options);
        return result;
    }
};

export async function handleFileOpenCommand(
    message: FileOpenCommand,
    onReplayMessage: (message: FileOpenCommand) => void
) {
    showOpenDialog({
        openLabel: uiTextToString(message.data?.label),
        filters: message.data?.filters,
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: message.data?.canSelectMany || false,
    }).then((result) => {
        const replayCommand = {
            ...message,
            data: {
                ...message.data,
                result: result?.map(file => file.fsPath) || [],
            }
        }
        onReplayMessage(replayCommand)
    })
}

export async function handleFileOpenFolderCommand(
    message: FileOpenFolderCommand,
    onReplayMessage: (message: FileOpenFolderCommand) => void
) {
    showOpenDialog({
        openLabel: uiTextToString(message.data?.label),
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: message.data?.canSelectMany || false,
        defaultUri: message.data?.result?.[0] ? vscode.Uri.file(message.data.result[0]) : undefined,
    }).then((result) => {
        const replayCommand = {
            ...message,
            data: {
                ...message.data,
                result: result?.map(file => file.fsPath) || [],
            }
        }
        onReplayMessage(replayCommand)
    })
}

export async function handleFileSaveCommand(
    message: FileSaveCommand,
    onReplayMessage: (message: FileSaveCommand) => void
) {
    saveFileDialog({
        saveLabel: uiTextToString(message.data?.label),
        filters: message.data?.filters,
        defaultUri: message.data?.result ? vscode.Uri.file(message.data.result) : undefined,
    }).then((result) => {
        const replayCommand = {
            ...message,
            data: {
                ...message.data,
                result: result?.fsPath || "",
            }
        }
        onReplayMessage(replayCommand)
    })
}

function checkFileSync(filePath: string): boolean {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true; // File or folder exists
    } catch (e) {
        return false; // File or folder does not exist
    }
}

export function handleFileExistsCommand(
    message: FileExistsCommand,
    onReplayMessage: (message: FileExistsCommand) => void
) {
    const exists = message.data?.path ? checkFileSync(message.data.path) : false;
    const replayCommand = {
        ...message,
        data: {
            path: message.data?.path || "",
            ...message.data,
            exists,
        },
    };
    onReplayMessage(replayCommand);
}