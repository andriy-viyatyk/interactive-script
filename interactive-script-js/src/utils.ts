import { commandLine } from "../../shared/constants";
import { ViewMessage } from "../../shared/ViewMessage";

export function messageToString(message: ViewMessage): string {
    return `${commandLine} ${JSON.stringify(message)}`;
}

export function messageFromString(line: string): ViewMessage | undefined {
    if (line.startsWith(commandLine)) {
        const command = line.substring(commandLine.length).trim();
        let commandObj: any = null;
        try {
            commandObj = JSON.parse(command);
        } catch (error) {
            console.error(`Error parsing command: ${error}`);
            return undefined;
        }
        if (commandObj?.command) {
            return commandObj;
        }
    }
    return undefined;
}
