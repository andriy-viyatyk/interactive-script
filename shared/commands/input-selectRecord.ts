import { newMessage, UiText, ViewMessage } from "../ViewMessage";
import { GridColumn } from "./output-grid";

export interface SelectRecordData {
    title?: UiText;
    records: any[];
    multiple?: boolean;
    columns?: GridColumn[];
    buttons?: UiText[];
    result?: any[];
    resultButton?: string;
}

export interface SelectRecordCommand extends ViewMessage<SelectRecordData> {
    command: "input.selectRecord";
}

export function isSelectRecordCommand(message: ViewMessage): message is SelectRecordCommand {
    return message.command === "input.selectRecord";
}

export default (data: SelectRecordData) => newMessage("input.selectRecord", data) as SelectRecordCommand;