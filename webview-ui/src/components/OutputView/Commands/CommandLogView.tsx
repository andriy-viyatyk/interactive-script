import styled from "@emotion/styled";
import color from "../../../theme/color";
import { LogCommand } from "../../../../../shared/commands/log";
import { UiTextView } from "../UiTextView";

const CommandLogViewRoot = styled.div({
    display: 'inline-block',
    whiteSpace: 'pre-wrap',
    minHeight: 17,

    '&.item-text': {
        color: color.text.default,
    },
    '&.item-info': {
        color: color.misc.blue,
    },
    '&.item-warn': {
        color: color.misc.yellow,
    },
    '&.item-error': {
        color: color.misc.red,
    },
    '&.item-success': {
        color: color.misc.green,
    },
})

export interface CommandLogViewProps {
    item: LogCommand;
}

export function CommandLogView({ item }: Readonly<CommandLogViewProps>) {
    const styleCommand = item.command.split('.').pop() || 'log';
    return (
        <CommandLogViewRoot className={`item-${styleCommand}`}>
            <UiTextView uiText={item.data}/>
        </CommandLogViewRoot>
    )
}