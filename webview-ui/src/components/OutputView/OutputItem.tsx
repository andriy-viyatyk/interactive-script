import styled from "@emotion/styled";
import { forwardRef, ReactNode } from "react";
import { CommandLogView } from "./CommandLogView";
import { ViewMessage } from "../../../../shared/ViewMessage";
import { isLogCommand } from "../../../../shared/commands/log";
import { isConfirmCommand } from "../../../../shared/commands/confirm";
import { CommandConfirmView } from "./CommandConfirmView";
import { isGridCommand } from "../../../../shared/commands/grid";
import { CommandGridView } from "./CommandGridView";
import { isTextCommand } from "../../../../shared/commands/text";
import { CommandTextBlockView } from "./CommandTextBlockView";
import color from "../../theme/color";

const OutputItemRoot = styled.div({
    lineHeight: "1.4em",
    maxWidth: "calc(100% - 30px)",
    position: "relative",
    '& .dialog-header': {
        color: color.text.light,
        backgroundColor: color.background.dark,
        borderBottom: `1px solid ${color.border.default}`,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        padding: "4px 8px",
        display: "flex",
        alignItems: "center",
        columnGap: 8,
        "& button": {
            padding: '0 2px',
        },
        whiteSpace: "pre",
    },
});

interface OutputItemProps {
    item: ViewMessage;
    onCheckSize?: () => void;
    replayMessage: (message: ViewMessage) => void;
    updateMessage: (message: ViewMessage) => void;
    sendMessage: (message: ViewMessage) => void;
}

export const OutputItem = forwardRef(function OutputItemComponent(
    { item, onCheckSize, replayMessage, updateMessage, sendMessage }: OutputItemProps,
    ref: React.Ref<HTMLDivElement>
) {
    let el: ReactNode = null;

    if (isLogCommand(item)) {
        el = <CommandLogView item={item} />;
    } else if (isConfirmCommand(item)) {
        el = (
            <CommandConfirmView
                item={item}
                replayMessage={replayMessage}
                updateMessage={updateMessage}
            />
        );
    } else if (isGridCommand(item)) {
        el = <CommandGridView item={item} sendMessage={sendMessage}/>;
    } else if (isTextCommand(item)) {
        el = <CommandTextBlockView item={item} onCheckSize={onCheckSize} />;
    }

    return (
        <OutputItemRoot className="output-item" ref={ref}>
            {el}
        </OutputItemRoot>
    );
});
