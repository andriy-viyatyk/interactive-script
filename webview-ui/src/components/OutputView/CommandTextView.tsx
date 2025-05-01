import styled from "@emotion/styled";
import color from "../../theme/color";
import { TextCommand } from "../../../../shared/commands/text";
import { EmptyIcon, ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from "../../theme/icons";

const CommandTextViewRoot = styled.div({
    // color: color.text.light,
    display: 'flex',
    alignItems: 'flex-start',
    '& .icon': {
        width: 16,
        height: 16,
        marginRight: 4,
    },
    '& .icon-error': {
        color: color.vs.red,
    },
    '& .icon-warn': {
        color: color.vs.yellow,
    },
    '& .icon-success': {
        color: color.vs.green,
    },
    '& .icon-info': {
        color: color.vs.blue,
    },
    '&.item-info': {
        color: color.vs.blue,
    },
    '&.item-warn': {
        color: color.vs.yellow,
    },
    '&.item-error': {
        color: color.vs.red,
    },
    '&.item-success': {
        color: color.vs.green,
    },
})

export interface CommandTextViewProps {
    item: TextCommand;
}

export function CommandTextView({ item }: CommandTextViewProps) {
    let icon = <EmptyIcon className="icon icon-log"/>;

    switch (item.command) {
        case "error":
            icon = <ErrorIcon className="icon icon-error"/>;
            break;
        case "warn":
            icon = <WarningIcon className="icon icon-warn"/>;
            break;
        case "info":
            icon = <InfoIcon className="icon icon-info"/>;
            break;
        case "success":
            icon = <SuccessIcon className="icon icon-success"/>;
            break;
    }

    return (
        <CommandTextViewRoot className={`item-${item.command}`}>
            {icon} {item.data}
        </CommandTextViewRoot>
    )
}