import { newMessage, ViewMessage } from "../ViewMessage";

export interface ConfirmData {
    title?: string;
    message: string;
    buttons?: string[];
    result?: string;
}

export interface ConfirmCommand extends ViewMessage<ConfirmData> {
    command: "confirm";
}

export function isConfirmCommand(message: ViewMessage): message is ConfirmCommand {
    return message.command === "confirm";
}

const confirm = (data: ConfirmData) => newMessage("confirm", data);

export default confirm;