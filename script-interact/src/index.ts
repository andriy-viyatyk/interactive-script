import * as readline from "readline";

import commands from "../../shared/commands";
import { commandLine } from "../../shared/constants";
import { ViewMessage } from "../../shared/ViewMessage";
import { ConfirmCommand, ConfirmData } from "../../shared/commands/confirm";
import { GridColumn } from "../../shared/commands/grid";

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
    log: (message: string) => send(commands.text.log(message)),
    error: (message: string) => send(commands.text.error(message)),
    info: (message: string) => send(commands.text.info(message)),
    warn: (message: string) => send(commands.text.warn(message)),
    success: (message: string) => send(commands.text.success(message)),
    clear: () => send(commands.clear()),
    dialog: {
        confirm: async (params: string | ConfirmData) => {
            const message = typeof params === 'string'
                ? commands.confirm({ message: params })
                : commands.confirm(params);
            const response = await withResponse(message);
            if (response) {
                return (response as ConfirmCommand).data?.result;
            } else {
                return undefined;
            }
        }
    },
    display: {
        gridFromJsonArray: (data: any[], options?: {title?: string, columns?: GridColumn[]}) =>
            send(commands.grid.fromJsonArray(data, options)),
    },
    window: {
        showGrid: (data: any[], options?: {title?: string, columns?: GridColumn[]}) =>
            send(commands.window.showGrid(data, options)),
    }
}

export default ui;