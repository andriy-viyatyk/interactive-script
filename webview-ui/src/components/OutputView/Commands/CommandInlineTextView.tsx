import styled from "@emotion/styled";
import { OutputDialog } from "../OutputDialog/OutputDialog";
import { InlineTextCommand } from "../../../../../shared/commands/inline-text";
import { ViewMessage } from "../../../../../shared/ViewMessage";
import { UiTextView } from "../UiTextView";
import { TextField } from "../../../controls/TextField";
import { OutputDialogButtons } from "../OutputDialog/OutputDialogButtons";
import clsx from "clsx";
import color from "../../../theme/color";
import { Button } from "../../../controls/Button";
import { CloseIcon } from "../../../theme/icons";
import { useCallback } from "react";

const CommandInlineTextRoot = styled(OutputDialog)({
    "& .command-inline-text-field": {
        "& input": {
            paddingTop: 0,
            paddingBottom: 1,
            height: 26,
        },
        "&.active input": {
            borderColor: color.border.active,
        },
        "& .clear-button": {
            display: "none",
        },
        "& .clear-button-visible": {
            display: "flex",
        },
    },
});

export interface CommandInlineTextViewProps {
    item: InlineTextCommand;
    replayMessage: (message: ViewMessage) => void;
    updateMessage: (message: ViewMessage) => void;
}

export function CommandInlineTextView({
    item,
    replayMessage,
    updateMessage,
}: Readonly<CommandInlineTextViewProps>) {
    const textChange = useCallback(
        (value: string) => {
            const newItem = {
                ...item,
                data: {
                    ...item.data,
                    result: value,
                },
            };
            updateMessage(newItem);
        },
        [item, updateMessage]
    );

    const handleClear = useCallback(() => {
        textChange("");
    }, [textChange]);

    const buttonClick = useCallback(
        (button: string) => {
            const message = {
                ...item,
                data: { ...item.data, resultButton: button },
            };
            replayMessage(message);
            updateMessage(message);
        },
        [item, replayMessage, updateMessage]
    );

    return (
        <CommandInlineTextRoot className="inline command-inline-text">
            <UiTextView uiText={item.data?.title} />
            <TextField
                className={clsx("command-inline-text-field", {
                    active: !item.data?.resultButton,
                })}
                value={item.data?.result || ""}
                onChange={textChange}
                title={item.data?.result}
                disabled={Boolean(item.data?.resultButton)}
                endButtons={[
                    <Button
                        size="small"
                        type="icon"
                        key="clear-button"
                        onClick={handleClear}
                        className={clsx("clear-button", {
                            "clear-button-visible": item.data?.result && !item.data?.resultButton,
                        })}
                        disabled={Boolean(item.data?.resultButton)}
                        tabIndex={-1}
                    >
                        <CloseIcon />
                    </Button>,
                ]}
            />
            <OutputDialogButtons
                buttons={item.data?.buttons}
                defaultButtons={["!Proceed"]}
                resultButton={item.data?.resultButton}
                onClick={buttonClick}
                required={!item.data?.result && !item.data?.resultButton}
                requiredHint="Input text to proceed."
                inline
            />
        </CommandInlineTextRoot>
    );
}
