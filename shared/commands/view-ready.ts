import { newMessage, ViewMessage } from "../ViewMessage";

export interface ViewReadyCommand extends ViewMessage<undefined> {
    command: "view.ready";
}

export function isViewReadyCommand(message: ViewMessage<undefined>): message is ViewReadyCommand {
    return message.command === "view.ready";
}

export default function viewReady(): ViewReadyCommand {
    return newMessage("view.ready", undefined) as ViewReadyCommand;
}