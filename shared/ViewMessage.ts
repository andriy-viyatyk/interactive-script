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
    | "textInput"
    | "windowGrid"
    | "windowText";

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

export interface Styles {
    [key: string]: string | number;
}

export type UiTextBlock = string | { text: string; styles?: Styles };
export type UiText = string | UiTextBlock[];

export function isUiText(text: any): text is UiText {
    return typeof text === "string" || Array.isArray(text);
}

export function uiTextToString(uiText?: UiText): string {
    if (uiText === undefined) {
        return '';
    }
    
    if (typeof uiText === 'string') {
        return uiText;
    }

    return uiText
        .map(block => typeof block === 'string' ? block : block.text)
        .join('');
}