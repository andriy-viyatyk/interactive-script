import { newMessage, ViewMessage } from "../ViewMessage";

export interface PingCommand extends ViewMessage {
    command: "ping";
}

export function isPingCommand(message: ViewMessage): message is PingCommand {
    return message.command === "ping";
}

export default function pingCommand(): PingCommand {
    return newMessage("ping") as PingCommand;
}