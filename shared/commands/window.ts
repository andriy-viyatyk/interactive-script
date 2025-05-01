import { newMessage, ViewMessage } from "../ViewMessage";
import { GridColumn } from "./grid";

export interface WindowGridData {
    title?: string;
    data: any[];
    columns?: GridColumn[];
}

export interface WindowGridCommand extends ViewMessage<WindowGridData> {
    command: "windowGrid";
}

export function isWindowGridCommand(message: ViewMessage): message is WindowGridCommand {
    return message.command === "windowGrid";
}

function showGrid(
    data: any[],
    options?: { title?: string; columns?: GridColumn[] }
): WindowGridCommand {
    return newMessage("windowGrid", {
        title: options?.title,
        data: data,
        columns: options?.columns,
    }) as WindowGridCommand;
}

export default {
    showGrid,
};
