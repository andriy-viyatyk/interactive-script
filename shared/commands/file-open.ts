import { newMessage, ViewMessage } from "../ViewMessage";

export interface FileOpenData {
    label?: string;
    filters?: { [key: string]: string[] };
    canSelectMany?: boolean;
    result?: string[];
}

export interface FileOpenCommand extends ViewMessage<FileOpenData> {
    command: "file.open";
}

export function isFileOpenCommand(message: ViewMessage): message is FileOpenCommand {
    return message.command === "file.open";
}

const fileOpen = (data: FileOpenData) => newMessage("file.open", data) as FileOpenCommand;

export default fileOpen;