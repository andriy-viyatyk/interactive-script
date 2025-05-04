import styled from "@emotion/styled";
import { forwardRef, ReactNode } from "react";
import { CommandLogView } from "./CommandLogView";
import { ViewMessage } from "../../../../shared/ViewMessage";
import { isLogCommand } from "../../../../shared/commands/log";
import { isConfirmCommand } from "../../../../shared/commands/input-confirm";
import { CommandConfirmView } from "./CommandConfirmView";
import { isGridCommand } from "../../../../shared/commands/output-grid";
import { CommandGridView } from "./CommandGridView";
import { isTextCommand } from "../../../../shared/commands/output-text";
import { CommandTextBlockView } from "./CommandTextBlockView";
import color from "../../theme/color";
import { isTextInputCommand } from "../../../../shared/commands/input-text";
import { CommandTextInputView } from "./CommandTextInput";
import { isButtonsCommand } from "../../../../shared/commands/input-buttons";
import { CommandButtonsView } from "./CommandButtonsView";
import { isProgressCommand } from "../../../../shared/commands/output-progress";
import { CommandProgressView } from "./CommandProgressView";
import { isCheckboxesCommand } from "../../../../shared/commands/input-checkboxes";
import { CommandCheckboxesView } from "./CommandCheckboxesView";

const OutputItemRoot = styled.div({
    lineHeight: "1.4em",
    maxWidth: "calc(100% - 30px)",
    position: "relative",
    "& .dialog": {
        margin: "4px 0",
        border: `1px solid ${color.border.default}`,
        borderRadius: 4,
    },
    "& .dialog-header": {
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
            padding: "0 2px",
        },
        whiteSpace: "pre",
    },
    "& .dialog-buttons": {
        display: "flex",
        flexDirection: "row",
        columnGap: 8,
        alignItems: "center",
        justifyContent: "flex-end",
        flexWrap: "wrap",
        padding: 4,
        paddingBottom: 0,
        marginBottom: 4,
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
    }

    return (
        <OutputItemRoot className="output-item" ref={ref}>
            {el}
        </OutputItemRoot>
    );
});
