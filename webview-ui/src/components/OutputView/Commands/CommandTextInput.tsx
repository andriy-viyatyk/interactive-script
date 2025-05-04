import styled from "@emotion/styled";
import { TextInputCommand } from "../../../../../shared/commands/input-text";
import { ViewMessage } from "../../../../../shared/ViewMessage";
import { useState } from "react";
import { TextAreaField } from "../../../controls/TextAreaField";
import color from "../../../theme/color";
import clsx from "clsx";
import { OutputDialog } from "../OutputDialog/OutputDialog";
import { OutputDialogHeader } from "../OutputDialog/OutputDialogHeader";
import { OutputDialogButtons } from "../OutputDialog/OutputDialogButtons";

const CommandTextInputViewRoot = styled(OutputDialog)({
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    "& .text-area-field": {
        flex: "1 1 auto",
        overflowY: "auto",
        borderRadius: 0,
        borderColor: "transparent",
        backgroundColor: color.background.light,
        margin: 2,
        whiteSpace: "pre",
        minHeight: 29,
        "&.multiline": {
            paddingBottom: 16,
            paddingRight: 16,
        },
        "&.readOnly": {
            backgroundColor: color.background.default,
            color: color.text.light,
        },
        "&:focus:not(.readOnly)": {
            borderColor: color.border.active,
        },
    },
});

interface CommandTextInputViewProps {
    item: TextInputCommand;
    replayMessage: (message: ViewMessage) => void;
    updateMessage: (message: ViewMessage) => void;
    onCheckSize?: () => void;
}

export function CommandTextInputView({
    item,
    replayMessage,
    updateMessage,
    onCheckSize,
}: Readonly<CommandTextInputViewProps>) {
    const [text, setText] = useState(item.data?.result || "");

    const setTextProxy = (value: string) => {
        setText(value);
        onCheckSize?.();
    };

    const buttonClick = (button: string) => {
        const message = {
            ...item,
            data: { ...item.data, result: text, resultButton: button },
        };
        replayMessage(message);
        updateMessage(message);
    };

    const readOnly = Boolean(item.data?.resultButton);

    return (
        <CommandTextInputViewRoot className="command-text-input">
            <OutputDialogHeader title={item.data?.title} />
            <TextAreaField
                className={clsx("text-area-field", { readOnly, multiline: text.indexOf("\n") > -1 })}
                value={text}
                onChange={setTextProxy}
                contentEditable={!readOnly}
            />
            <OutputDialogButtons 
                buttons={item.data?.buttons}
                defaultButtons={["Cancel", "Proceed"]}
                resultButton={item.data?.resultButton}
                onClick={buttonClick}
            />
        </CommandTextInputViewRoot>
    );
}
