import { newMessage, UiText, ViewMessage } from "../ViewMessage";

export interface FileShowOpenData {
    label?: UiText;
    filters?: { [key: string]: string[] };
    canSelectMany?: boolean;
    buttons?: UiText[];
    result?: string[];
    resultButton?: string;
}

export interface FileShowOpenCommand extends ViewMessage<FileShowOpenData> {
    command: "file.showOpen";
}

export function isFileShowOpenCommand(message: ViewMessage): message is FileShowOpenCommand {
    return message.command === "file.showOpen";
}

const fileShowOpen = (data: FileShowOpenData) => newMessage("file.showOpen", data) as FileShowOpenCommand;

export default fileShowOpen;