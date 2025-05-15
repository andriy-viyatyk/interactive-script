import * as vscode from "vscode";
import {
    WindowGridCommand,
    WindowTextCommand,
} from "../../shared/commands/window";
import vars from "../vars";
import views from "../web-view/Views";

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
