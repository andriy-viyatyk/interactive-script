import styled from "@emotion/styled";
import { CSSProperties, useCallback, useRef, useState } from "react";
import { ViewMessage } from "../../../../shared/ViewMessage";
import { OutputItem } from "./OutputItem";
import clsx from "clsx";

const OutputItemCellRoot = styled.div({
    justifyContent: "flex-start",
    alignItems: "center",
});

interface OutputItemCellProps {
    row: number;
    style: CSSProperties;
    item: ViewMessage;
    setRowHeight: (row: number, height: number) => void;
    replayMessage: (message: ViewMessage) => void;
    updateMessage: (message: ViewMessage) => void;
    sendMessage: (message: ViewMessage) => void;
}

export function OutputItemCell({
    row,
    style,
    item,
    setRowHeight,
    replayMessage,
    updateMessage,
    sendMessage,
}: Readonly<OutputItemCellProps>) {
    const [hovered, setHovered] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);

    const onCheckSize = useCallback(() => {
        if (divRef.current) {
            setTimeout(() => {
                if (divRef.current) {
                    const rect = divRef.current.getBoundingClientRect();
                    setRowHeight(row, rect.height);
                }
            }, 0);
        }
    }, [row, setRowHeight]);

    return (
        <OutputItemCellRoot
            style={{ ...style, display: "flex" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={clsx({ hovered })}
        >
            <OutputItem
                item={item}
                ref={(div) => {
                    divRef.current = div as HTMLDivElement;
                    onCheckSize();
                }}
                onCheckSize={onCheckSize}
                replayMessage={replayMessage}
                updateMessage={updateMessage}
                sendMessage={sendMessage}
            />
        </OutputItemCellRoot>
    );
}
