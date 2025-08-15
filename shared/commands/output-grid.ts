import { newMessage, UiText, ViewMessage } from "../ViewMessage";

export interface GridColumn {
    key: string;
    title?: string;
    width?: number;
    dataType?: "string" | "number" | "boolean";
    options?: string[];
}

export interface GridData {
    title?: UiText;
    data: any[];
    columns?: GridColumn[];
}

export interface GridCommand extends ViewMessage<GridData> {
    command: "output.grid";
}

export function isGridCommand(message: ViewMessage): message is GridCommand {
    return message.command === "output.grid";
}

const fromJsonArray = (data: GridData) => {
    return newMessage("output.grid", data) as GridCommand;
}

export default {
    fromJsonArray,
}