import { newMessage, ViewMessage } from "../ViewMessage";

export interface FileExistsData {
    path: string;
    exists?: boolean;
}

export interface FileExistsCommand extends ViewMessage<FileExistsData> {
    command: "file.exists";
}

export function isFileExistsCommand(message: ViewMessage): message is FileExistsCommand {
    return message.command === "file.exists";
}

const fileExists = (data: FileExistsData) => 
    newMessage("file.exists", data) as FileExistsCommand;

export default fileExists;