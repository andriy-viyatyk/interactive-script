import styled from '@emotion/styled';
import { CSSProperties, useState } from 'react';
import { ViewMessage } from '../../../../shared/ViewMessage';
import { OutputItem } from './OutputItem';
import clsx from 'clsx';

const OutputItemCellRoot = styled.div({
    justifyContent: 'flex-start',
    alignItems: 'center',
});

interface OutputItemCellProps {
    row: number;
    style: CSSProperties;
    item: ViewMessage;
    setRowHeight: (row: number, height: number) => void;
    onCheckSize?: (item: ViewMessage, itemDiv: HTMLDivElement) => void;
    replayMessage: (message: ViewMessage) => void;
    updateMessage: (message: ViewMessage) => void;
    sendMessage: (message: ViewMessage) => void;
}

export function OutputItemCell({
    row,
    style,
    item,
    setRowHeight,
    onCheckSize,
    replayMessage,
    updateMessage,
    sendMessage,
}: Readonly<OutputItemCellProps>) {
    const [hovered, setHovered] = useState(false);

    return (
        <OutputItemCellRoot
            style={{ ...style, display: 'flex' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={clsx({hovered})}
        >
            <OutputItem
                item={item}
                ref={(div) => {
                    if (div) {
                        const rect = div.getBoundingClientRect();
                        setRowHeight(row, rect.height);
                    }
                }}
                onCheckSize={onCheckSize}
                replayMessage={replayMessage}
                updateMessage={updateMessage}
                sendMessage={sendMessage}
            />
        </OutputItemCellRoot>
    );
}
