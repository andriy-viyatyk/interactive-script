import styled from "@emotion/styled";
import { TextInputCommand } from "../../../../shared/commands/textInput";
import { uiTextToString, ViewMessage } from "../../../../shared/ViewMessage";
import { useState } from "react";
import { TextAreaField } from "../../controls/TextAreaField";
import { Button } from "../../controls/Button";
import { CheckIcon } from "../../theme/icons";
import color from "../../theme/color";
import clsx from "clsx";
import { UiTextView } from "./UiTextView";

const CommandTextInputViewRoot = styled.div({
    "& .text-area-field": {
        borderRadius: 0,
        borderColor: "transparent",
        backgroundColor: color.background.light,
        margin: 2,
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
    let buttons = item.data?.buttons || ["Cancel", "Proceed"];
    if (buttons.length === 0) {
        buttons = ["Proceed"];
    }

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
        <CommandTextInputViewRoot className="command-text-input dialog">
            <div className="dialog-header"><UiTextView uiText={item.data?.title} /></div>
            <TextAreaField
                className={clsx("text-area-field", { readOnly })}
                value={text}
                onChange={setTextProxy}
                contentEditable={!readOnly}
            />
            <div className="dialog-buttons">
                {buttons.map((button, index) => (
                    <Button
                        size="small"
                        key={`${uiTextToString(button)}-${index}`}
                        onClick={() => buttonClick(uiTextToString(button))}
                        disabled={Boolean(item.data?.resultButton)}
                    >
                        {item.data?.resultButton === uiTextToString(button) ? <CheckIcon /> : null}
                        <UiTextView uiText={button} />
                    </Button>
                ))}
            </div>
        </CommandTextInputViewRoot>
    );
}
