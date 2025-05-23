import styled from "@emotion/styled";
import { TextCommand } from "../../../../../shared/commands/output-text";
import color from "../../../theme/color";
import clsx from "clsx";
import { Button } from "../../../controls/Button";
import { CopyIcon, OpenWindowIcon } from "../../../theme/icons";
import { toClipboard } from "../../../common/utils/utils";
import { ViewMessage } from "../../../../../shared/ViewMessage";
import commands from "../../../../../shared/commands";
import { OutputDialog } from "../OutputDialog/OutputDialog";
import { OutputDialogHeader } from "../OutputDialog/OutputDialogHeader";
import { useItemState } from "../OutputViewContext";

const CommandTextBlockViewRoot = styled(OutputDialog)({
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    "& .text-data": {
        flex: '1 1 auto',
        whiteSpace: "pre",
        color: color.text.default,
        overflowY: "auto",
        padding: 8,
        paddingBottom: 20,
        "&.wrap": {
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
        },
    },
});

export interface CommandTextBlockViewProps {
    item: TextCommand;
    onCheckSize?: () => void;
    sendMessage: (message: ViewMessage) => void;
}

export function CommandTextBlockView({
    item,
    onCheckSize,
    sendMessage,
}: Readonly<CommandTextBlockViewProps>) {
    const [wrap, setWrap] = useItemState(item.commandId, "wrap", false);

    const setWrapProxy = (value: boolean) => {
        setWrap(value);
        onCheckSize?.();
    };

    return (
        <CommandTextBlockViewRoot className="text-block">
            <OutputDialogHeader title={item.data?.title}>
                <Button
                    size="mini"
                    onClick={() => setWrapProxy(!wrap)}
                    title={wrap ? "no-wrap text" : "wrap text"}
                >
                    {wrap ? "no-wrap" : "wrap"}
                </Button>
                <Button
                    size="small"
                    type="icon"
                    onClick={() => {
                        toClipboard(item.data?.text ?? "");
                    }}
                    title="Copy to clipboard"
                >
                    <CopyIcon />
                </Button>
                <Button
                    size="small"
                    type="icon"
                    title="Open in separate window"
                    onClick={() => {
                        sendMessage(
                            commands.window.showText({
                                text: item.data?.text ?? "",
                                language: "plaintext",
                            })
                        );
                    }}
                >
                    <OpenWindowIcon />
                </Button>
            </OutputDialogHeader>
            <div className={clsx("text-data", { wrap })}>{item.data?.text}</div>
        </CommandTextBlockViewRoot>
    );
}
