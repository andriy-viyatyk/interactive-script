import * as vscode from "vscode";
import vars from "../vars";

let outputChannel: vscode.OutputChannel | undefined;

function prepareChannel() {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel("Script UI");
        vars.extensionContext?.subscriptions.push(outputChannel);
    }
}

export function writeOutput(message: string) {
    prepareChannel();
    if (outputChannel) {
        outputChannel.appendLine(message);
    }
}

export function clearOutput() {
    if (outputChannel) {
        outputChannel.clear();
    }
}