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
    private uiCheckRun = false;

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
                this.commandMap.delete(message.commandId);
                resolve(message);
                this.closeRlIfIdle();
            }
        }
    }

    send = <T>(message: ViewMessage): Promise<ViewMessage<T>> => {
        if (!this.uiCheckRun) {
            this.uiCheckRun = true;
            this.runUiCheck();
        }

        const messageToSend: ViewMessage = { ...message, isResponseRequired: true };
        return new Promise<ViewMessage<T>>((resolve) => {
            this.createRl();
            this.commandMap.set(messageToSend.commandId, resolve);
            console.log(messageToString(messageToSend));
        });
    }

    runUiCheck = async () => {
        const message = commands.ping();
        const uiPromise = this.send(message);
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));
        const whenAny = (await Promise.race([uiPromise, timeoutPromise]) as any);
        
        if (whenAny?.command === "ping") {
            return true;
        }
    
        console.error(`
    **************************************************************************************************************
        UI not available.

        This module "interactive-script-js" is designed to be run by "Interactive Script" VSCode extension.
        If you have this extension installed, please run script from "SCRIPT UI" tab ('run' button in tab header).
        If you can't find "SCRIPT UI" tab, find it in VSCode menu: View => Open View => <search by 'SCRIPT UI'>.

        Otherwise we have problem. You can try to reinstall "Interactive Script" extension and/or restart VSCode.
    ***************************************************************************************************************    
        `);
    }
}

export const responseHandler = new ResponseHandler();
