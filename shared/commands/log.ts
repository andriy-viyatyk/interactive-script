import { newMessage, UiText, ViewMessage } from "../ViewMessage";

export interface LogCommand extends ViewMessage<UiText> {
    command: "log.text" | "log.log" | "log.info" | "log.warn" | "log.error" | "log.success";
}

export function isLogCommand(message: ViewMessage): message is LogCommand {
    return (
        message.command === "log.text" ||
        message.command === "log.log" ||
        message.command === "log.info" ||
        message.command === "log.warn" ||
        message.command === "log.error" ||
        message.command === "log.success"
    );
}

export default {
    text: (message: UiText) => newMessage("log.text", message) as LogCommand,
    log: (message: UiText) => newMessage("log.log", message) as LogCommand,
    info: (message: UiText) => newMessage("log.info", message) as LogCommand,
    warn: (message: UiText) => newMessage("log.warn", message) as LogCommand,
    error: (message: UiText) => newMessage("log.error", message) as LogCommand,
    success: (message: UiText) => newMessage("log.success", message) as LogCommand,
};
