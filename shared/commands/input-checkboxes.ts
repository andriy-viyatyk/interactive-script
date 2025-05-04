import { newMessage, Styles, UiText, ViewMessage } from "../ViewMessage";

export interface CheckboxItem {
    label: UiText;
    checked?: boolean;
}

export interface CheckboxesData {
    items: CheckboxItem[];
    title?: UiText;
    buttons?: UiText[];
    result?: string[];
    resultButton?: string;
    bodyStyles?: Styles;
}

export interface CheckboxesCommand extends ViewMessage<CheckboxesData> {
    command: "input.checkboxes";
}

export function isCheckboxesCommand(message: ViewMessage): message is CheckboxesCommand {
    return message.command === "input.checkboxes";
}

export default function checkboxes(data: CheckboxesData) {
    return newMessage("input.checkboxes", data) as CheckboxesCommand;
}