import styled from "@emotion/styled";
import color from "../../theme/color";
import { LogCommand } from "../../../../shared/commands/log";

const CommandLogViewRoot = styled.div({
    display: 'flex',
    alignItems: 'flex-start',
    whiteSpace: 'pre',

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
    return (
        <CommandLogViewRoot className={`item-${item.command}`}>
            {item.data}
        </CommandLogViewRoot>
    )
}