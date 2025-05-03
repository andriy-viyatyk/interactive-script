import styled from "@emotion/styled";
import { TextCommand } from "../../../../shared/commands/output-text";
import color from "../../theme/color";
import clsx from "clsx";
import { FlexSpace } from "../../controls/FlexSpace";
import { Button } from "../../controls/Button";
import { useState } from "react";
import { CopyIcon, OpenWindowIcon } from "../../theme/icons";
import { toClipboard } from "../../common/utils/utils";
import { ViewMessage } from "../../../../shared/ViewMessage";
import commands from "../../../../shared/commands";

const CommandTextBlockViewRoot = styled.div({
    "& .text-data": {
        whiteSpace: "pre",
        color: color.text.default,
        maxHeight: 400,
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
    const [wrap, setWrap] = useState(false);

    const setWrapProxy = (value: boolean) => {
        setWrap(value);
        onCheckSize?.();
    };

    return (
        <CommandTextBlockViewRoot className="text-block dialog">
            <div className="dialog-header">
                {item.data?.title}
                <FlexSpace />
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
                                language: 'plaintext',
                            })
                        );
                    }}
                >
                    <OpenWindowIcon />
                </Button>
            </div>
            <div className={clsx("text-data", { wrap })}>{item.data?.text}</div>
        </CommandTextBlockViewRoot>
    );
}
