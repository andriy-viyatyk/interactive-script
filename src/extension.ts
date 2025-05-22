import * as vscode from "vscode";
import { activateCodeRunner } from "./code-runner/activateCodeRunner";
import { activateView } from "./web-view/activateView";
import vars from "./vars";
import { activateOtherCommands } from "./otherCommands";

export function activate(context: vscode.ExtensionContext) {
    vars.extensionContext = context;
    activateView(context);
    activateCodeRunner(context);
    activateOtherCommands(context);
}
