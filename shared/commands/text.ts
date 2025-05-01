import { newMessage, ViewMessage } from "../ViewMessage";

export interface TextCommand extends ViewMessage<string> {
    command: "log" | "info" | "warn" | "error" | "success";
}

export function isTextCommand(message: ViewMessage): message is TextCommand {
    return (
        message.command === "log" ||
        message.command === "info" ||
        message.command === "warn" ||
        message.command === "error" ||
        message.command === "success"
    );
}

export default {
    log: (message: string) => newMessage("log", message),
    info: (message: string) => newMessage("info", message),
    warn: (message: string) => newMessage("warn", message),
    error: (message: string) => newMessage("error", message),
    success: (message: string) => newMessage("success", message),
};
