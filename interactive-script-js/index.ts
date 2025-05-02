import * as readline from "readline";

import commands from "../shared/commands";
import { commandLine } from "../shared/constants";
import { isUiText, UiText, ViewMessage } from "../shared/ViewMessage";
import { ConfirmCommand, ConfirmData } from "../shared/commands/confirm";
import { GridColumn } from "../shared/commands/grid";
import { TextInputCommand, TextInputData } from "../shared/commands/textInput";

function messageToString(message: ViewMessage): string {
    return `${commandLine} ${JSON.stringify(message)}`;
}

function messageFromString(line: string): ViewMessage | undefined {
    if (line.startsWith(commandLine)) {
        const command = line.substring(commandLine.length).trim();
        let commandObj: any = null;
        try {
            commandObj = JSON.parse(command);
        } catch (error) {
            console.error(`Error parsing command: ${error}`);
            return undefined;
        }
        if (commandObj?.command) {
            return commandObj;
        }
    }
    return undefined;
}

function send(message: ViewMessage) {
    console.log(messageToString(message));
}

function withResponse(message: ViewMessage): Promise<ViewMessage | undefined> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const messageToSend: ViewMessage = { ...message, isResponseRequired: true };
    return new Promise((resolve) => {
        rl.question(messageToString(messageToSend), (ans) => {
            rl.close();
            resolve(messageFromString(ans));
        });
    });
}

const ui = {
    log: (message: UiText) => send(commands.log.log(message)),
    error: (message: UiText) => send(commands.log.error(message)),
    info: (message: UiText) => send(commands.log.info(message)),
    warn: (message: UiText) => send(commands.log.warn(message)),
    success: (message: UiText) => send(commands.log.success(message)),
    clear: () => send(commands.clear()),
    dialog: {
        confirm: async (params: UiText | ConfirmData) => {
            const message =
                isUiText(params)
                    ? commands.confirm({ message: params })
                    : commands.confirm(params);
            const response = await withResponse(message);
            if (response) {
                return (response as ConfirmCommand).data?.result;
            } else {
                return undefined;
            }
        },

        textInput: async (params: UiText | TextInputData) => {
            const message =
                isUiText(params)
                    ? commands.textInput({ title: params })
                    : commands.textInput(params);
            const response = await withResponse(message);
            if (response) {
                return (response as TextInputCommand).data;
            } else {
                return undefined;
            }
        },
    },
    display: {
        gridFromJsonArray: (
            data: any[],
            options?: { title?: UiText; columns?: GridColumn[] }
        ) => send(commands.grid.fromJsonArray(data, options)),

        textBlock: (data: string, options?: { title?: string }) =>
            send(commands.text({ text: data, title: options?.title })),
    },
    window: {
        showGrid: (
            data: any[],
            options?: { title?: string; columns?: GridColumn[] }
        ) => send(commands.window.showGrid({ data, ...options })),

        showText: (text: string, options?: { language?: string }) =>
            send(commands.window.showText({ text, ...options })),
    },
};

export default ui;
