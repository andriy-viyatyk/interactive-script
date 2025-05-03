import { newMessage, UiText, ViewMessage } from "../ViewMessage";

export interface GridColumn {
    key: string;
    title?: string;
    width?: number;
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

const fromJsonArray = (data: any[], options?: {title?: UiText, columns?: GridColumn[]}) => {
    return newMessage("output.grid", {
        title: options?.title,
        data: data,
        columns: options?.columns,
    });
}

export default {
    fromJsonArray,
}