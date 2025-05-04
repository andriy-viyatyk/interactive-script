import { newMessage, UiText, ViewMessage } from "../ViewMessage";

export interface TextData {
    text: string;
    title?: UiText;
}

export interface TextCommand extends ViewMessage<TextData> {
    command: "output.text";
}

export function isTextCommand(message: ViewMessage): message is TextCommand {
    return message.command === "output.text";
}

export default (data: TextData) => newMessage("output.text", data) as TextCommand;
