import styled from "@emotion/styled";
import { forwardRef, ReactNode } from "react";
import { CommandTextView } from "./CommandTextView";
import { ViewMessage } from "../../../../shared/ViewMessage";
import { isTextCommand } from "../../../../shared/commands/text";
import { isConfirmCommand } from "../../../../shared/commands/confirm";
import { CommandConfirmView } from "./CommandConfirmView";
import { isGridCommand } from "../../../../shared/commands/grid";
import { CommandGridView } from "./CommandGridView";

const OutputItemRoot = styled.div({
    fontSize: 14,
    lineHeight: 1,
    maxWidth: "calc(100% - 20px)",
    position: "relative",
});

interface OutputItemProps {
    item: ViewMessage;
    onCheckSize?: (item: ViewMessage, itemDiv: HTMLDivElement) => void;
    replayMessage: (message: ViewMessage) => void;
    updateMessage: (message: ViewMessage) => void;
    sendMessage: (message: ViewMessage) => void;
}

export const OutputItem = forwardRef(function OutputItemComponent(
    { item, replayMessage, updateMessage, sendMessage }: OutputItemProps,
    ref: React.Ref<HTMLDivElement>
) {
    let el: ReactNode = null;

    if (isTextCommand(item)) {
        el = <CommandTextView item={item} />;
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
    }

    return (
        <OutputItemRoot className="output-item" ref={ref}>
            {el}
        </OutputItemRoot>
    );
});
