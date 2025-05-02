import { newMessage, ViewMessage } from "../ViewMessage";

export interface TextData {
    text: string;
    title?: string;
}

export interface TextCommand extends ViewMessage<TextData> {
    command: "text";
}

export function isTextCommand(message: ViewMessage): message is TextCommand {
    return message.command === "text";
}

export default (data: TextData) => newMessage("text", data);
