import { newMessage, Styles, UiText, ViewMessage } from "../ViewMessage";

export interface ButtonsData {
    buttons: UiText[];
    bodyStyles?: Styles;
    result?: string;
}

export interface ButtonsCommand extends ViewMessage<ButtonsData> {
    command: "input.buttons";
}

export function isButtonsCommand(message: ViewMessage): message is ButtonsCommand {
    return message.command === "input.buttons";
}

export default function buttons(data: ButtonsData) {
    return newMessage("input.buttons", data) as ButtonsCommand;
}