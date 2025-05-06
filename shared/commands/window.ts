import { newMessage, UiText, ViewMessage } from "../ViewMessage";
import { GridColumn } from "./output-grid";

// WindowGridCommand

export interface WindowGridData {
    title?: UiText;
    data: any[];
    columns?: GridColumn[];
}

export interface WindowGridCommand extends ViewMessage<WindowGridData> {
    command: "window.grid";
}

export function isWindowGridCommand(
    message: ViewMessage
): message is WindowGridCommand {
    return message.command === "window.grid";
}

function showGrid(data: WindowGridData): WindowGridCommand {
    return newMessage("window.grid", data) as WindowGridCommand;
}

// WindowTextCommand

export interface WindowTextData {
    text: string;
    language?: string;
}

export interface WindowTextCommand extends ViewMessage<WindowTextData> {
    command: "window.text";
}
export function isWindowTextCommand(
    message: ViewMessage
): message is WindowTextCommand {
    return message.command === "window.text";
}

export function showText(data: WindowTextData): WindowTextCommand {
    return newMessage("window.text", data) as WindowTextCommand;
}

export default {
    showGrid,
    showText,
};
