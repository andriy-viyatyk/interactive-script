import { newMessage, UiText, ViewMessage } from "../ViewMessage";

export interface LogCommand extends ViewMessage<UiText> {
    command: "log.log" | "log.info" | "log.warn" | "log.error" | "log.success";
}

export function isLogCommand(message: ViewMessage): message is LogCommand {
    return (
        message.command === "log.log" ||
        message.command === "log.info" ||
        message.command === "log.warn" ||
        message.command === "log.error" ||
        message.command === "log.success"
    );
}

export default {
    log: (message: UiText) => newMessage("log.log", message),
    info: (message: UiText) => newMessage("log.info", message),
    warn: (message: UiText) => newMessage("log.warn", message),
    error: (message: UiText) => newMessage("log.error", message),
    success: (message: UiText) => newMessage("log.success", message),
};
