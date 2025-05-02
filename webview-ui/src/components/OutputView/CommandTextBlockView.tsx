import styled from "@emotion/styled";
import { TextCommand } from "../../../../shared/commands/text";
import color from "../../theme/color";
import clsx from "clsx";
import { FlexSpace } from "../../controls/FlexSpace";
import { Button } from "../../controls/Button";
import { useState } from "react";
import { CopyIcon } from "../../theme/icons";
import { toClipboard } from "../../common/utils/utils";

const CommandTextBlockViewRoot = styled.div({
    margin: "4px 0",
    border: `1px solid ${color.border.default}`,
    borderRadius: 4,
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
}

export function CommandTextBlockView({
    item,
    onCheckSize,
}: Readonly<CommandTextBlockViewProps>) {
    const [wrap, setWrap] = useState(false);

    const setWrapProxy = (value: boolean) => {
        setWrap(value);
        onCheckSize?.();
    };

    return (
        <CommandTextBlockViewRoot className="text-block">
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
            </div>
            <div className={clsx("text-data", { wrap })}>{item.data?.text}</div>
        </CommandTextBlockViewRoot>
    );
}
