import * as readline from "readline";

import { ViewMessage } from "../../shared/ViewMessage";
import { messageFromString, messageToString } from "./utils";
import commands from "../../shared/commands";

export function send<T extends ViewMessage>(message: T): T {
    console.log(messageToString(message));
    return message;
}

type ResponseHandlerResolve = (message: ViewMessage) => void;
class ResponseHandler {
    private rl: readline.Interface | undefined;
    private readonly commandMap: Map<string, ResponseHandlerResolve> = new Map();

    private createRl() {
        if (!this.rl) {
            this.rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            this.rl.on("line", this.onLine);
        }
    }

    private closeRlIfIdle() {
        if (this.rl && this.commandMap.size === 0) {
            this.rl.close();
            this.rl = undefined;
        }
    }

    private readonly onLine = (line: string) => {
        const message = messageFromString(line);
        if (message) {
            const resolve = this.commandMap.get(message.commandId);
            if (resolve) {
                if (!message.isEvent) {
                    this.commandMap.delete(message.commandId);
                }
                resolve(message);
                this.closeRlIfIdle();
            }
        }
    }

    send = <T>(message: ViewMessage<T>): Promise<ViewMessage<T>> => {
        return new Promise<ViewMessage<T>>((resolve) => {
            this.createRl();
            this.commandMap.set(message.commandId, resolve);
            console.log(messageToString(message));
        });
    }

    subscribe = <T>(message: ViewMessage<T>, update: (message: ViewMessage<T>) => any) => {
        this.createRl();
        const messageToSend = { ...message, isEvent: true };
        this.commandMap.set(message.commandId, update);
        console.log(messageToString(messageToSend));

        return {
            unsubscribe: () => {
                this.commandMap.delete(message.commandId);
                this.closeRlIfIdle();
            }
        }
    }
}

export const responseHandler = new ResponseHandler();
