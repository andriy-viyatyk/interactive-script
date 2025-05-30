import { newMessage, UiText, ViewMessage } from "../ViewMessage";

export interface FileShowOpenFolderData {
    label?: UiText;
    canSelectMany?: boolean;
    buttons?: UiText[];
    result?: string[];
    resultButton?: string;
}

export interface FileShowOpenFolderCommand extends ViewMessage<FileShowOpenFolderData> {
    command: "file.showOpenFolder";
}

export function isFileShowOpenFolderCommand(message: ViewMessage): message is FileShowOpenFolderCommand {
    return message.command === "file.showOpenFolder";
}

const fileShowOpenFolder = (data: FileShowOpenFolderData) => newMessage("file.showOpenFolder", data) as FileShowOpenFolderCommand;

export default fileShowOpenFolder;