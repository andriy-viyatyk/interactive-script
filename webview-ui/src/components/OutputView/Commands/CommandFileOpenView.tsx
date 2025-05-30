import styled from "@emotion/styled";
import { OutputDialog } from "../OutputDialog/OutputDialog";
import { uiTextToString, ViewMessage } from "../../../../../shared/ViewMessage";
import { UiTextView } from "../UiTextView";
import { useItemState } from "../OutputViewContext";
import { TextAreaField } from "../../../controls/TextAreaField";
import color from "../../../theme/color";
import clsx from "clsx";
import { OutputDialogButtons } from "../OutputDialog/OutputDialogButtons";
import { FileShowOpenCommand } from "../../../../../shared/commands/file-showOpen";
import { Button } from "../../../controls/Button";
import { FileSearchIcon } from "../../../theme/icons";
import { useCallback } from "react";
import commands from "../../../../../shared/commands";
import { responseHandler } from "../../responseHandler";

const CommandFileOpenRoot = styled(OutputDialog)({
    "& .input-wrapper": {
        display: "flex",
        alignItems: "flex-start",
        columnGap: 4,
        maxWidth: "100%",
        border: `1px solid ${color.border.default}`,
        borderRadius: 4,
        minHeight: 26,
        padding: "2px 0 0 6px",
        boxSizing: "border-box",
        "&.active": {
            borderColor: color.border.active,
        },
        "&.error": {
            borderColor: color.misc.red,
        },
        "& .file-search-button": {
            marginTop: -1,
        },
        "& .text-area-field": {
            flex: "1 1 auto",
            overflowY: "auto",
            overflowX: "auto",
            border: "none",
            whiteSpace: "pre",
            minWidth: 180,
            padding: 0,
            "&.multiline": {
                paddingBottom: 16,
                paddingRight: 16,
            },
            "&.readonly": {
                backgroundColor: color.background.default,
                color: color.text.light,
            },
        },
    },
});

export interface CommandFileOpenViewProps {
    item: FileShowOpenCommand;
    replayMessage: (message: ViewMessage) => void;
    updateMessage: (message: ViewMessage) => void;
    onCheckSize?: () => void;
}

function trimResult(result?: string[]) {
    return (
        result
            ?.map((line) => line.trim())
            .filter((line) => line.length > 0)
            .join("\n") ?? ""
    );
}

function textToResult(text: string) {
    return text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
}

async function fileExists(path: string): Promise<boolean> {
    const message = commands.fileExists({ path });
    const response = await responseHandler.sendRequest(message);
    return response.data?.exists ?? false;
}

export function CommandFileOpenView({
    item,
    replayMessage,
    updateMessage,
    onCheckSize,
}: Readonly<CommandFileOpenViewProps>) {
    const [text, setText] = useItemState(
        item.commandId,
        "text",
        trimResult(item.data?.result)
    );
    const [error, setError] = useItemState(item.commandId, "error", "");

    const setTextProxy = useCallback(
        (value: string) => {
            setText(value);
            setError("");
            onCheckSize?.();
        },
        [setText, setError, onCheckSize]
    );

    const buttonClick = useCallback(
        async (button: string) => {
            const files = textToResult(text);
            const allExists = await Promise.all(
                files.map((file) => fileExists(file))
            );
            if (allExists.some((exists) => !exists)) {
                const errorIndex = allExists.findIndex((exists) => !exists);
                setError(`File not found: ${files[errorIndex]}`);
                return;
            }

            const message = {
                ...item,
                data: { ...item.data, result: files, resultButton: button },
            };
            replayMessage(message);
            updateMessage(message);
        },
        [item, replayMessage, setError, text, updateMessage]
    );

    const fileOpenClick = useCallback(async () => {
        const message = commands.fileOpen({
            canSelectMany: item.data?.canSelectMany,
            label: uiTextToString(item.data?.label),
            result: textToResult(text),
        });
        const response = await responseHandler.sendRequest(message);
        setTextProxy(trimResult(response.data?.result));
    }, [item.data?.canSelectMany, item.data?.label, setTextProxy, text]);

    const readonly = Boolean(item.data?.resultButton);

    return (
        <CommandFileOpenRoot className="inline">
            <UiTextView uiText={item.data?.label} />
            <div
                className={clsx("input-wrapper", {
                    active: !readonly,
                    error: Boolean(error),
                })}
            >
                <TextAreaField
                    className={clsx("text-area-field", {
                        readonly,
                        multiline: text.indexOf("\n") > -1,
                    })}
                    value={text}
                    onChange={setTextProxy}
                    readonly={readonly}
                    singleLine={!item.data?.canSelectMany}
                    title={error || text}
                />
                <Button
                    size="small"
                    type="icon"
                    title="Search file"
                    onClick={fileOpenClick}
                    disabled={readonly}
                    className="file-search-button"
                >
                    <FileSearchIcon />
                </Button>
            </div>
            <OutputDialogButtons
                buttons={item.data?.buttons}
                defaultButtons={["!Proceed"]}
                resultButton={item.data?.resultButton}
                onClick={buttonClick}
                required={!text}
                requiredHint="Input file path to proceed."
                inline
            />
        </CommandFileOpenRoot>
    );
}
