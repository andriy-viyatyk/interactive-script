import { newMessage, UiText, ViewMessage } from "../ViewMessage";
import { GridColumn } from "./output-grid";

export interface InputGridData {
    title?: UiText;
    columns?: GridColumn[];
    editOnly?: boolean;
    buttons?: UiText[];
    result?: any[];
    resultButton?: string;
}

export interface InputGridCommand extends ViewMessage<InputGridData> {
    command: "input.grid";
}

export function isInputGridCommand(message: ViewMessage): message is InputGridCommand {
    return message.command === "input.grid";
}

export default (data: InputGridData) => newMessage("input.grid", data) as InputGridCommand;