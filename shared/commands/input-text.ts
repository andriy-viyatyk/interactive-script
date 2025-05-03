import { newMessage, UiText, ViewMessage } from "../ViewMessage";

export interface TextInputData {
    title: UiText;
    buttons?: UiText[];
}

export interface TextInputResultData extends TextInputData {
    result: string;
    resultButton: string;
}

export interface TextInputCommand extends ViewMessage<TextInputResultData> {
    command: "input.text";
}

export function isTextInputCommand(message: ViewMessage): message is TextInputCommand {
    return message.command === "input.text";
}

export default (data: TextInputData) => newMessage("input.text", data);