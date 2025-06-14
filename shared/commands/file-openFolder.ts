import { newMessage, ViewMessage } from "../ViewMessage";

export interface FileOpenFolderData {
    label?: string;
    canSelectMany?: boolean;
    result?: string[];
}

export interface FileOpenFolderCommand extends ViewMessage<FileOpenFolderData> {
    command: "file.openFolder";
}

export function isFileOpenFolderCommand(message: ViewMessage): message is FileOpenFolderCommand {
    return message.command === "file.openFolder";
}

const fileOpenFolder = (data: FileOpenFolderData) => newMessage("file.openFolder", data) as FileOpenFolderCommand;

export default fileOpenFolder;