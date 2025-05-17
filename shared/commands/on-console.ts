import { newMessage, ViewMessage } from "../ViewMessage";

export interface OnConsoleCommand extends ViewMessage<string> {
    command: "on.console.log" | "on.console.error";
}

export function isOnConsoleCommand(
    message: ViewMessage
): message is OnConsoleCommand {
    return (
        message.command === "on.console.log" ||
        message.command === "on.console.error"
    );
}

export function isOnConsoleLogCommand(
    message: ViewMessage
): message is OnConsoleCommand {
    return message.command === "on.console.log";
}

export function isOnConsoleErrorCommand(
    message: ViewMessage
): message is OnConsoleCommand {
    return message.command === "on.console.error";
}

export default {
    log: () => newMessage("on.console.log") as OnConsoleCommand,
    error: () => newMessage("on.console.error") as OnConsoleCommand,
}