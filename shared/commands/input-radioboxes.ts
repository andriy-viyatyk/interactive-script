import { newMessage, Styles, UiText, ViewMessage } from "../ViewMessage";

export interface RadioboxesData {
    items: UiText[];
    title?: UiText;
    buttons?: UiText[];
    result?: string;
    resultButton?: string;
    bodyStyles?: Styles;
}

export interface RadioboxesCommand extends ViewMessage<RadioboxesData> {
    command: "input.radioboxes";
}

export function isRadioboxesCommand(message: ViewMessage): message is RadioboxesCommand {
    return message.command === "input.radioboxes";
}

export default function radioboxes(data: RadioboxesData) {
    return newMessage("input.radioboxes", data) as RadioboxesCommand;
}