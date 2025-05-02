import { newMessage, ViewMessage } from "../ViewMessage";
import { GridColumn } from "./grid";

// WindowGridCommand

export interface WindowGridData {
    title?: string;
    data: any[];
    columns?: GridColumn[];
}

export interface WindowGridCommand extends ViewMessage<WindowGridData> {
    command: "windowGrid";
}

export function isWindowGridCommand(
    message: ViewMessage
): message is WindowGridCommand {
    return message.command === "windowGrid";
}

function showGrid(data: WindowGridData): WindowGridCommand {
    return newMessage("windowGrid", data) as WindowGridCommand;
}

// WindowTextCommand

export interface WindowTextData {
    text: string;
    language?: string;
}

export interface WindowTextCommand extends ViewMessage<WindowTextData> {
    command: "windowText";
}
export function isWindowTextCommand(
    message: ViewMessage
): message is WindowTextCommand {
    return message.command === "windowText";
}

export function showText(data: WindowTextData): WindowTextCommand {
    return newMessage("windowText", data) as WindowTextCommand;
}

export default {
    showGrid,
    showText,
};
