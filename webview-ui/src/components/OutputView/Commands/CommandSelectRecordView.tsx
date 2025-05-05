import styled from "@emotion/styled";
import { SelectRecordCommand } from "../../../../../shared/commands/input-selectRecord";
import { OutputDialog } from "../OutputDialog/OutputDialog";
import { OutputDialogHeader } from "../OutputDialog/OutputDialogHeader";
import AVGrid from "../../../controls/AVGrid/AVGrid";
import { getRowKey, useGridDataWithColumns } from "../../useGridData";
import { OutputDialogButtons } from "../OutputDialog/OutputDialogButtons";
import { SetStateAction, useCallback, useMemo } from "react";
import { ViewMessage } from "../../../../../shared/ViewMessage";
import { resolveState } from "../../../common/utils/utils";
import { HighlightedTextProvider } from "../../../controls/useHighlightedText";
import { useGridSearchHeight } from "./useGridSearchHeight";
import { CloseIcon, SearchIcon } from "../../../theme/icons";
import { Button } from "../../../controls/Button";
import { TextField } from "../../../controls/TextField";
import color from "../../../theme/color";

const CommandSelectRecordViewRoot = styled(OutputDialog)({
    position: "relative",
    maxHeight: "unset",
    "& .search-field": {
        padding: 0,
        "& input": {
            padding: 4,
            backgroundColor: color.background.dark,
            color: color.misc.blue,
            border: `1px solid ${color.border.default}`,
            height: "unset",
            "&:focus": {
                borderColor: color.border.active,
            },
        },
        "& .search-icon": {
            width: 14,
            height: 14,
            padding: 1,
            marginRight: 4,
            color: color.icon.light,
        },
        "& .clear-search": {
            marginRight: 4,
        },
    },
});

interface CommandSelectRecordViewProps {
    item: SelectRecordCommand;
    replayMessage: (message: ViewMessage) => void;
    updateMessage: (message: ViewMessage) => void;
}

export function CommandSelectRecordView({
    item,
    updateMessage,
    replayMessage,
}: Readonly<CommandSelectRecordViewProps>) {
    const multiple = item.data?.multiple ?? false;
    const readonly = Boolean(item.data?.resultButton);
    const data = useGridDataWithColumns(
        item.data?.records,
        item.data?.columns,
        multiple
    );
    const { search, setSearch, gridWrapperRef, gridWrapperHeight } =
        useGridSearchHeight();

    const selected = useMemo(() => {
        const result = item.data?.result ?? [];
        const sel = new Set<string>();
        result.forEach((r) => {
            sel.add(getRowKey(r));
        });
        return sel as ReadonlySet<string>;
    }, [item.data?.result]);

    const setSelected = useCallback(
        (value: SetStateAction<ReadonlySet<string>>) => {
            if (readonly) return;
            const sel = resolveState(value, () => selected);
            const result = data.rows.filter((r) => sel.has(getRowKey(r)));
            const newItem = {
                ...item,
                data: {
                    ...item.data,
                    result: result,
                },
            };
            updateMessage(newItem);
        },
        [data.rows, item, readonly, selected, updateMessage]
    );

    const rowClick = useCallback(
        (row: any) => {
            if (readonly) return;
            setSelected(new Set([getRowKey(row)]));
        },
        [readonly, setSelected]
    );

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
            replayMessage(newItem);
        },
        [item, replayMessage, updateMessage]
    );

    return (
        <CommandSelectRecordViewRoot>
            <OutputDialogHeader title={item.data?.title}>
                <TextField
                    value={search}
                    onChange={setSearch}
                    className="search-field"
                    endButtons={[
                        ...(search
                            ? [
                                  <Button
                                      size="small"
                                      type="icon"
                                      onClick={() => setSearch("")}
                                      key="clear-search"
                                      title="Clear search"
                                      className="clear-search"
                                  >
                                      <CloseIcon />
                                  </Button>,
                              ]
                            : []),
                        <SearchIcon
                            key="search-icon"
                            className="search-icon"
                        />,
                    ]}
                />
            </OutputDialogHeader>
            <div
                ref={gridWrapperRef}
                className="command-grid-view"
                style={{ height: gridWrapperHeight }}
            >
                <HighlightedTextProvider value={search}>
                    <AVGrid
                        columns={data.columns}
                        rows={data.rows}
                        getRowKey={getRowKey}
                        grawToHeight={400}
                        grawToWidth="100%"
                        selected={selected}
                        setSelected={multiple ? setSelected : undefined}
                        onClick={multiple ? undefined : rowClick}
                        readonly={readonly}
                        searchString={search}
                    />
                </HighlightedTextProvider>
            </div>
            <OutputDialogButtons
                buttons={item.data?.buttons}
                resultButton={item.data?.resultButton}
                defaultButtons={["Select"]}
                onClick={buttonClick}
            />
        </CommandSelectRecordViewRoot>
    );
}
