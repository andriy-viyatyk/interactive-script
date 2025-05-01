import { forwardRef, Ref, useCallback, useImperativeHandle } from 'react';

import RenderGrid from '../../controls/RenderGrid/RenderGrid';
import { Percent, RenderCellParams } from '../../controls/RenderGrid/types';
import { TComponentModel, useComponentModel } from '../../common/classes/model';
import RenderGridModel from '../../controls/RenderGrid/RenderGridModel';
import { ViewMessage } from '../../../../shared/ViewMessage';
import { OutputItemCell } from './OutputItemCell';

const columnWidth: () => Percent = () => '100%';
const defaultRowHeight = 17;

const defaultOutputItemListState = {
    rowHeight: undefined as ((row: number) => number) | undefined,
};

type OutputItemListState = typeof defaultOutputItemListState;

interface OutputItemListProps {
    items: ViewMessage[];
    replayMessage: (message: ViewMessage) => void;
    updateMessage: (message: ViewMessage) => void;
    sendMessage: (message: ViewMessage) => void;
}

export class OutputItemListModel extends TComponentModel<
    OutputItemListState,
    OutputItemListProps
> {
    rowHeights: number[] = [];
    gridModel: RenderGridModel | null = null;
    scrollingDown = new Date('2020-01-01');

    setProps = (props: OutputItemListProps) => {
        if (this.oldProps?.items !== props.items) {
            this.rowHeights.length = props.items?.length ?? 0;
            this.updateRowHeight();
            this.gridModel?.update({ all: true });
            if (this.oldProps && props.items.length > this.oldProps.items.length) {
                this.scrollDown();
            }
        }
    };

    setRowHeight = (row: number, height: number) => {
        if (this.rowHeights[row] === height) {
            return;
        }
        this.rowHeights[row] = height;
        this.updateRowHeight(row);
    };

    private readonly updateRowHeight = (updatedRow?: number) => {
        setTimeout(() => {
            this.state.update((s) => {
                s.rowHeight = (row: number) =>
                    (this.rowHeights[row] ?? defaultRowHeight)
            });
            if (updatedRow !== undefined) {
                this.gridModel?.update({ rows: [updatedRow] });
            }
        }, 0);

        if (this.scrollingDown.getTime() > new Date().getTime() - 1000) {
            this.justScrollDown();
        }
    };

    scrollDown = () => {
        this.scrollingDown = new Date();
        this.justScrollDown();
    }

    private readonly justScrollDown = () => {
        setTimeout(() => {
            this.gridModel?.scrollBy({ x: 0, y: Number.MAX_SAFE_INTEGER });
        }, 1);
    };

    onCheckSize = (item: ViewMessage, itemDiv: HTMLDivElement) => {
        const row = this.props.items.findIndex((i) => i.commandId === item.commandId);
        if (row >= 0) {
            this.setRowHeight(row, itemDiv.scrollHeight);
        }
    };
}

export const OutputItemList = forwardRef(function OutputItemListComponent(
    props: OutputItemListProps,
    ref: Ref<OutputItemListModel>,
) {
    const { items } = props;
    const model = useComponentModel(
        props,
        OutputItemListModel,
        defaultOutputItemListState,
    );
    const state = model.state.use();

    useImperativeHandle(ref, () => model, [model]);

    const renderCell = useCallback(
        (p: RenderCellParams) => {
            return (
                <OutputItemCell
                    row={p.row}
                    style={p.style}
                    key={p.key}
                    item={items[p.row]}
                    setRowHeight={model.setRowHeight}
                    onCheckSize={model.onCheckSize}
                    replayMessage={props.replayMessage}
                    updateMessage={props.updateMessage}
                    sendMessage={props.sendMessage}
                />
            );
        },
        [items, model, props.replayMessage],
    );

    return (
        <RenderGrid
            ref={(m) => {
                model.gridModel = m;
            }}
            rowCount={items.length}
            columnCount={1}
            columnWidth={columnWidth}
            rowHeight={state.rowHeight}
            renderCell={renderCell}
            fitToWidth
        />
    );
});
