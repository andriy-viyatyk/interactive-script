import styled from "@emotion/styled";
import { OutputDialog } from "../OutputDialog/OutputDialog";
import { InputGridCommand } from "../../../../../shared/commands/input-grid";
import { ViewMessage } from "../../../../../shared/ViewMessage";
import { TModel, useModel } from "../../../common/classes/model";
import { useComponentState } from "../OutputViewContext";
import { SetStateAction, useCallback, useEffect } from "react";
import { createIdColumn, getRowKey, idColumnKey, removeIdColumn, useGridColumns } from "../../useGridData";
import AVGrid from "../../../controls/AVGrid/AVGrid";
import { OutputDialogHeader } from "../OutputDialog/OutputDialogHeader";
import { CellFocus } from "../../../controls/AVGrid/avGridTypes";
import { resolveState } from "../../../common/utils/utils";
import { OutputDialogButtons } from "../OutputDialog/OutputDialogButtons";

const CommandGridInputViewRoot = styled(OutputDialog)({
    "& .input-grid-wrapper": {
        height: 300,
        display: "flex",
        flexDirection: "column",
    }
});

const defaultCommandGridInputViewState = {
    rows: [] as any[],
    focus: undefined as CellFocus | undefined,
    nextId: 0,
    rowsSet: false,
}

type CommandGridInputViewState = typeof defaultCommandGridInputViewState;

class CommandGridInputViewModel extends TModel<CommandGridInputViewState> {
    setRows = (rows?: any[]) => {
        if (this.state.get().rowsSet) return;

        const stateRows = createIdColumn(rows ?? []);
        const maxId = stateRows.length;

        this.state.update((state) => {
            state.rows = stateRows;
            state.nextId = maxId;
            state.rowsSet = true;
        });
    }

    setFocus = (focus?: SetStateAction<CellFocus | undefined>) => {
        this.state.update((s) => {
            s.focus = focus ? resolveState(focus, () => s.focus) : undefined;
        });
    };

    editRow = (columnKey: string, rowKey: string, value: any) => {
        this.state.update((s) => {
            const row = s.rows.find((r) => getRowKey(r) === rowKey);
            if (row) {
                (row as any)[columnKey] = value;
            }
        });
    };

    onAddRows = (count: number, insertIndex?: number) => {
        let nextId = this.state.get().nextId;
        const newRows = Array.from({ length: count }, () => ({
            [idColumnKey]: (nextId++).toString(),
        }));
        this.state.update((s) => {
            if (insertIndex !== undefined) {
                s.rows.splice(insertIndex, 0, ...newRows);
            } else {
                s.rows.push(...newRows);
            }
            s.nextId = nextId;
        });
        return newRows;
    };

    onDeleteRows = (rowKeys: string[]) => {
        this.state.update((s) => {
            s.rows = s.rows.filter((r) => !rowKeys.includes(getRowKey(r)));
        });
    };
}

interface CommandGridInputViewProps {
    item: InputGridCommand;
    replayMessage: (message: ViewMessage) => void;
    updateMessage: (message: ViewMessage) => void;
}

export function CommandGridInputView({item, replayMessage, updateMessage}: Readonly<CommandGridInputViewProps>) {
    const modelState = useComponentState(item.commandId, defaultCommandGridInputViewState);
    const model = useModel(CommandGridInputViewModel, modelState);
    const state = model.state.use();

    useEffect(() => {
        model.setRows(item.data?.result);
    }, [item.data?.result, model]);

    const columns = useGridColumns(item.data?.columns);
    const readonly = Boolean(item.data?.resultButton);

    const buttonClick = useCallback(
        (button: string) => {
            const newItem = {
                ...item,
                data: {
                    ...item.data,
                    resultButton: button,
                },
            };
            updateMessage(newItem);
            const replayItem = {
                ...item,
                data: {
                    ...item.data,
                    resultButton: button,
                    result: removeIdColumn(state.rows),
                },
            };
            replayMessage(replayItem);
        },
        [item, replayMessage, state.rows, updateMessage]
    );

    return (
        <CommandGridInputViewRoot active={!item.data?.resultButton}>
            <OutputDialogHeader title={item.data?.title}></OutputDialogHeader>
            <div className="input-grid-wrapper">
                <AVGrid
                    columns={columns}
                    rows={state.rows}
                    getRowKey={getRowKey}
                    focus={state.focus}
                    setFocus={model.setFocus}
                    growToWidth="100%"
                    disableFiltering
                    editRow={readonly ? undefined : model.editRow}
                    onAddRows={readonly ||item.data?.editOnly ? undefined : model.onAddRows}
                    onDeleteRows={readonly || item.data?.editOnly ? undefined : model.onDeleteRows}
                />
            </div>
            <OutputDialogButtons
                buttons={item.data?.buttons}
                resultButton={item.data?.resultButton}
                defaultButtons={["Proceed"]}
                onClick={buttonClick}
                required={false}
            />
        </CommandGridInputViewRoot>
    )
}