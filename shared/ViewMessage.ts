import { v4 } from "uuid";

export type Command =
    | "view.ready"
    | "script.start"
    | "script.stop"
    | "ping"
    | "clear"
    | "output"
    | "output.clear"
    | "log.text"
    | "log.log"
    | "log.info"
    | "log.success"
    | "log.warn"
    | "log.error"
    | "input.confirm"
    | "input.text"
    | "input.buttons"
    | "input.checkboxes"
    | "input.radioboxes"
    | "input.selectRecord"
    | "input.date"
    | "inline.select"
    | "inline.confirm"
    | "inline.text"
    | "output.grid"
    | "output.text"
    | "output.progress"
    | "window.grid"
    | "window.text"
    | "on.console.log"
    | "on.console.error";

export interface ViewMessage<T = any> {
    command: Command;
    commandId: string;
    data?: T;
    isEvent?: boolean;
}

export function newMessage<T>(
    command: Command,
    data?: T,
    commandId?: string,
    isEvent?: boolean
): ViewMessage<T> {
    return {
        command,
        commandId: commandId || v4(),
        data,
        isEvent
    };
}

export interface Styles {
    [key: string]: string | number;
}

export type TextWithStyle = { text: string; styles?: Styles };
export type UiTextBlock = string | TextWithStyle;
export type UiText = string | UiTextBlock[];

export function isUiText(text: any): text is UiText {
    return typeof text === "string" || Array.isArray(text);
}

export function uiTextToString(uiText?: UiText): string {
    if (uiText === undefined) {
        return "";
    }

    if (typeof uiText === "string") {
        return uiText;
    }

    if (Array.isArray(uiText)) {
        return uiText
            .map((block) => (typeof block === "string" ? block : block.text))
            .join("");
    }

    return "";
}
