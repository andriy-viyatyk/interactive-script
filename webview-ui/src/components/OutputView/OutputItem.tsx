import styled from "@emotion/styled";
import { forwardRef, ReactNode } from "react";
import { CommandLogView } from "./Commands/CommandLogView";
import { ViewMessage } from "../../../../shared/ViewMessage";
import { isLogCommand } from "../../../../shared/commands/log";
import { isConfirmCommand } from "../../../../shared/commands/input-confirm";
import { CommandConfirmView } from "./Commands/CommandConfirmView";
import { isGridCommand } from "../../../../shared/commands/output-grid";
import { CommandGridView } from "./Commands/CommandGridView";
import { isTextCommand } from "../../../../shared/commands/output-text";
import { CommandTextBlockView } from "./Commands/CommandTextBlockView";
import { isTextInputCommand } from "../../../../shared/commands/input-text";
import { CommandTextInputView } from "./Commands/CommandTextInput";
import { isButtonsCommand } from "../../../../shared/commands/input-buttons";
import { CommandButtonsView } from "./Commands/CommandButtonsView";
import { isProgressCommand } from "../../../../shared/commands/output-progress";
import { CommandProgressView } from "./Commands/CommandProgressView";
import { isCheckboxesCommand } from "../../../../shared/commands/input-checkboxes";
import { CommandCheckboxesView } from "./Commands/CommandCheckboxesView";
import { isRadioboxesCommand } from "../../../../shared/commands/input-radioboxes";
import { CommandRadioboxesView } from "./Commands/CommandRadioboxesView";
import { isSelectRecordCommand } from "../../../../shared/commands/input-selectRecord";
import { CommandSelectRecordView } from "./Commands/CommandSelectRecordView";
import { isDateInputCommand } from "../../../../shared/commands/input-date";
import { CommandDateInputView } from "./Commands/CommandDateInputView";
import { isSelectCommand } from "../../../../shared/commands/inline-select";
import { CommandSelectView } from "./Commands/CommandSelectView";
import { isInlineConfirmCommand } from "../../../../shared/commands/inline-confirm";
import { CommandInlineConfirmView } from "./Commands/CommandInlineConfirmView";
import { isInlineTextCommand } from "../../../../shared/commands/inline-text";
import { CommandInlineTextView } from "./Commands/CommandInlineTextView";
import { isInlineDateInputCommand } from "../../../../shared/commands/inline-date";
import { CommandInlineDateView } from "./Commands/CommandInlineDateView";

const OutputItemRoot = styled.div({
    lineHeight: "1.4em",
    maxWidth: "calc(100% - 30px)",
    position: "relative",
});

interface OutputItemProps {
    item: ViewMessage;
    onCheckSize: () => void;
    replayMessage: (message: ViewMessage) => void;
    updateMessage: (message: ViewMessage) => void;
    sendMessage: (message: ViewMessage) => void;
}

export const OutputItem = forwardRef(function OutputItemComponent(
    {
        item,
        onCheckSize,
        replayMessage,
        updateMessage,
        sendMessage,
    }: OutputItemProps,
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
        el = <CommandGridView item={item} sendMessage={sendMessage} />;
    } else if (isTextCommand(item)) {
        el = (
            <CommandTextBlockView
                item={item}
                onCheckSize={onCheckSize}
                sendMessage={sendMessage}
            />
        );
    } else if (isTextInputCommand(item)) {
        el = (
            <CommandTextInputView
                item={item}
                replayMessage={replayMessage}
                updateMessage={updateMessage}
                onCheckSize={onCheckSize}
            />
        );
    } else if (isButtonsCommand(item)) {
        el = (
            <CommandButtonsView
                item={item}
                replayMessage={replayMessage}
                updateMessage={updateMessage}
            />
        );
    } else if (isProgressCommand(item)) {
        el = <CommandProgressView item={item} />;
    } else if (isCheckboxesCommand(item)) {
        el = <CommandCheckboxesView item={item} replayMessage={replayMessage} updateMessage={updateMessage} />;
    } else if (isRadioboxesCommand(item)) {
        el = <CommandRadioboxesView item={item} replayMessage={replayMessage} updateMessage={updateMessage} />;
    } else if (isSelectRecordCommand(item)) {
        el = <CommandSelectRecordView item={item} replayMessage={replayMessage} updateMessage={updateMessage} />;
    } else if (isDateInputCommand(item)) {
        el = <CommandDateInputView item={item} replayMessage={replayMessage} updateMessage={updateMessage} onCheckSize={onCheckSize} />;
    } else if (isSelectCommand(item)) {
        el = <CommandSelectView item={item} replayMessage={replayMessage} updateMessage={updateMessage} />;
    } else if (isInlineConfirmCommand(item)) {
        el = <CommandInlineConfirmView item={item} replayMessage={replayMessage} updateMessage={updateMessage} />;
    } else if (isInlineTextCommand(item)) {
        el = <CommandInlineTextView item={item} replayMessage={replayMessage} updateMessage={updateMessage} />;
    } else if (isInlineDateInputCommand(item)) {
        el = <CommandInlineDateView item={item} replayMessage={replayMessage} updateMessage={updateMessage} onCheckSize={onCheckSize} />;
    }

    return (
        <OutputItemRoot className="output-item" ref={ref}>
            {el}
        </OutputItemRoot>
    );
});
