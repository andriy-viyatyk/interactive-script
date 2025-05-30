import { newMessage, ViewMessage } from "../ViewMessage";

export interface FileSaveData {
    label?: string;
    filters?: { [key: string]: string[] };
    result?: string;
}

export interface FileSaveCommand extends ViewMessage<FileSaveData> {
    command: "file.save";
}

export function isFileSaveCommand(message: ViewMessage): message is FileSaveCommand {
    return message.command === "file.save";
}

const fileSave = (data: FileSaveData) => newMessage("file.save", data) as FileSaveCommand;

export default fileSave;