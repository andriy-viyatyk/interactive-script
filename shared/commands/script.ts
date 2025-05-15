import { newMessage, ViewMessage } from "../ViewMessage";

export interface ScriptStartCommand extends ViewMessage<string> {
    command: "script.start";
}

export interface ScriptStopCommand extends ViewMessage<undefined> {
    command: "script.stop";
}

export function isScriptStartCommand(message: ViewMessage): message is ScriptStartCommand {
    return message.command === "script.start";
}

export function isScriptStopCommand(message: ViewMessage): message is ScriptStopCommand {
    return message.command === "script.stop";
}

export default {
    start: (filePath: string) => newMessage("script.start", filePath) as ScriptStartCommand,
    stop: () => newMessage("script.stop") as ScriptStopCommand,
};