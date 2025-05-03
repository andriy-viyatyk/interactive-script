import { newMessage, UiText, ViewMessage } from "../ViewMessage";

export interface ConfirmData {
    title?: UiText;
    message: UiText;
    buttons?: UiText[];
    result?: string;
}

export interface ConfirmCommand extends ViewMessage<ConfirmData> {
    command: "input.confirm";
}

export function isConfirmCommand(message: ViewMessage): message is ConfirmCommand {
    return message.command === "input.confirm";
}

const confirm = (data: ConfirmData) => newMessage("input.confirm", data);

export default confirm;