import { newMessage, UiText, ViewMessage } from "../ViewMessage";

export interface ProgressData {
    max?: number;
    value?: number;
    label?: UiText;
    completed?: boolean;
}

export interface ProgressCommand extends ViewMessage<ProgressData> {
    command: "output.progress";
}

export function isProgressCommand(message: ViewMessage): message is ProgressCommand {
    return message.command === "output.progress";
}

export default function progress(data: ProgressData) {
    return newMessage("output.progress", data) as ProgressCommand;
}
