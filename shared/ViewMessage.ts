import { v4 } from "uuid";

export type Command =
    | "log"
    | "info"
    | "success"
    | "warn"
    | "error"
    | "clear"
    | "confirm"
    | "grid"
    | "text"
    | "windowGrid";

export interface ViewMessage<T = any> {
    command: Command;
    commandId: string;
    data?: T;
    isResponse?: boolean;
    error?: string;
    isResponseRequired?: boolean;
}

export function newMessage<T>(
    command: Command,
    data?: T,
    commandId?: string
): ViewMessage<T> {
    return {
        command,
        commandId: commandId || v4(),
        data,
        isResponse: Boolean(commandId),
        error: undefined,
        isResponseRequired: false,
    };
}
