import { newMessage, ViewMessage } from "../ViewMessage";
import { DateInputData } from "./input-date";

export interface InlineDateInputCommand extends ViewMessage<DateInputData> {
    command: "inline.date";
}

export function isInlineDateInputCommand(message: ViewMessage): message is InlineDateInputCommand {
    return message.command === "inline.date";
}

export default (data: DateInputData) => newMessage("inline.date", data) as InlineDateInputCommand;