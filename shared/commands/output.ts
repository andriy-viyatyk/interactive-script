import { newMessage, ViewMessage } from "../ViewMessage";

export interface OutputCommand extends ViewMessage<string> {
    command: "output";
}

export function isOutputCommand(
    message: ViewMessage
): message is OutputCommand {
    return message.command === "output";
}

export interface OutputClearCommand extends ViewMessage<undefined> {
    command: "output.clear";
}

export function isOutputClearCommand(
    message: ViewMessage
): message is OutputClearCommand {
    return message.command === "output.clear";
}

export default {
    append: (message: string) => {
        return newMessage("output", message) as OutputCommand;
    },
    clear: () => {
        return newMessage("output.clear") as OutputClearCommand;
    }
}