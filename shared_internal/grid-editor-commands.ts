import { Command, newMessage, ViewMessage } from "../shared/ViewMessage";

export type GridEditorCommand = Command | "gridEditor.changed";

export function isGridEditorCommand(message: ViewMessage<any, string>): boolean {
    return  message.command.startsWith("gridEditor.");
}

export interface GridEditorChangedData {
    content: string;
}

export interface GridEditorChangedCommand extends ViewMessage<GridEditorChangedData, GridEditorCommand> {
    command: "gridEditor.changed";
}

export function isGridEditorChangedCommand(message: ViewMessage<any, string>): message is GridEditorChangedCommand {
    return message.command === "gridEditor.changed";
}

export const gridEditorChangedCommand = (data: GridEditorChangedData) => newMessage("gridEditor.changed", data) as GridEditorChangedCommand;