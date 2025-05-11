import { newMessage, UiText, ViewMessage } from "../ViewMessage";

export interface DateInputData {
    title?: UiText;
    buttons?: UiText[];
    result?: Date;
    resultButton?: string;
}

export interface DateInputCommand extends ViewMessage<DateInputData> {
    command: "input.date";
}

export function isDateInputCommand(message: ViewMessage): message is DateInputCommand {
    return message.command === "input.date";
}

export default (data: DateInputData) => newMessage("input.date", data) as DateInputCommand;