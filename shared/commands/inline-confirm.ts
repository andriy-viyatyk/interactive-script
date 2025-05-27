import { newMessage, ViewMessage } from "../ViewMessage";
import { ConfirmData } from "./input-confirm";

export type InlineConfirmData = Omit<ConfirmData, "title">;

export interface InlineConfirmCommand extends ViewMessage<InlineConfirmData> {
    command: "inline.confirm";
}

export function isInlineConfirmCommand(message: ViewMessage): message is InlineConfirmCommand {
    return message.command === "inline.confirm";
}

const inlineConfirm = (data: InlineConfirmData) => newMessage("inline.confirm", data) as InlineConfirmCommand;

export default inlineConfirm;