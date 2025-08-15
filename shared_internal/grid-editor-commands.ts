import { Command, newMessage, ViewMessage } from "../shared/ViewMessage";

export type GridEditorCommand = Command | "gridEditor.changed" | "gridEditor.saveAs";

export function isGridEditorCommand(message: ViewMessage<any, string>): boolean {
    return  message.command.startsWith("gridEditor.");
}

// changed

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

// saveAs

export interface GridEditorSaveAsData {
    content: string;
    format: "json" | "csv";
}

export interface GridEditorSaveAsCommand extends ViewMessage<GridEditorSaveAsData, GridEditorCommand> {
    command: "gridEditor.saveAs";
}

export function isGridEditorSaveAsCommand(message: ViewMessage<any, string>): message is GridEditorSaveAsCommand {
    return message.command === "gridEditor.saveAs";
}

export const gridEditorSaveAsCommand = (data: GridEditorSaveAsData) => newMessage("gridEditor.saveAs", data) as GridEditorSaveAsCommand;