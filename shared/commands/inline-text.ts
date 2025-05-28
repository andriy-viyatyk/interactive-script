import { TextInputData } from "./input-text";
import { newMessage, ViewMessage } from "../ViewMessage";

export interface InlineTextCommand extends ViewMessage<TextInputData> {
    command: "inline.text";
}

export function isInlineTextCommand(message: ViewMessage): message is InlineTextCommand {
    return message.command === "inline.text";
}

export default (data: TextInputData) => newMessage("inline.text", data) as InlineTextCommand;