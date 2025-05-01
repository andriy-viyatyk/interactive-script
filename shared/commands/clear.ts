import { newMessage, ViewMessage } from "../ViewMessage";

export interface ClearCommand extends ViewMessage<undefined> {
    command: "clear";
}

export function isClearCommand(message: ViewMessage): message is ClearCommand {
    return message.command === "clear";
}

export default function clear(): ClearCommand {
    return newMessage<undefined>("clear") as ClearCommand;
}