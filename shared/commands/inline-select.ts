import { newMessage, UiText, ViewMessage } from "../ViewMessage";

export interface SelectData<T = any> {
    label: UiText;
    options: T[];
    labelKey?: string;
    buttons?: UiText[];
    result?: T;
    resultButton?: string;
}

export interface SelectCommand<T = any> extends ViewMessage<SelectData<T>> {
    command: "inline.select";
}

export function isSelectCommand(message: ViewMessage): message is SelectCommand {
    return message.command === "inline.select";
}

export default <T = any>(data: SelectData<T>) => newMessage("inline.select", data) as SelectCommand<T>;