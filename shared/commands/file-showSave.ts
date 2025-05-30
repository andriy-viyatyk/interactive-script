import { newMessage, UiText, ViewMessage } from "../ViewMessage";

export interface FileShowSaveData {
    label?: UiText;
    filters?: { [key: string]: string[] };
    buttons?: UiText[];
    result?: string;
    resultButton?: string;
}

export interface FileShowSaveCommand extends ViewMessage<FileShowSaveData> {
    command: "file.showSave";
}

export function isFileShowSaveCommand(message: ViewMessage): message is FileShowSaveCommand {
    return message.command === "file.showSave";
}

const fileShowSave = (data: FileShowSaveData) => newMessage("file.showSave", data) as FileShowSaveCommand;

export default fileShowSave;