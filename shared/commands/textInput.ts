import { newMessage, ViewMessage } from "../ViewMessage";

export interface TextInputData {
    title: string;
    buttons?: string[];
}

export interface TextInputResultData extends TextInputData {
    result: string;
    resultButton: string;
}

export interface TextInputCommand extends ViewMessage<TextInputResultData> {
    command: "textInput";
}

export function isTextInputCommand(message: ViewMessage): message is TextInputCommand {
    return message.command === "textInput";
}

export default (data: TextInputData) => newMessage("textInput", data);