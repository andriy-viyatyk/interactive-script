import * as readline from "readline";

import { ViewMessage } from "../../shared/ViewMessage";
import { messageFromString, messageToString } from "./utils";

export function send<T extends ViewMessage>(message: T): T {
    console.log(messageToString(message));
    return message;
}

export function withResponse(message: ViewMessage): Promise<ViewMessage | undefined> {
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