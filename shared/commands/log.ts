import { newMessage, UiText, ViewMessage } from "../ViewMessage";

export interface LogCommand extends ViewMessage<UiText> {
    command: "log" | "info" | "warn" | "error" | "success";
}

export function isLogCommand(message: ViewMessage): message is LogCommand {
    return (
        message.command === "log" ||
        message.command === "info" ||
        message.command === "warn" ||
        message.command === "error" ||
        message.command === "success"
    );
}

export default {
    log: (message: UiText) => newMessage("log", message),
    info: (message: UiText) => newMessage("info", message),
    warn: (message: UiText) => newMessage("warn", message),
    error: (message: UiText) => newMessage("error", message),
    success: (message: UiText) => newMessage("success", message),
};
