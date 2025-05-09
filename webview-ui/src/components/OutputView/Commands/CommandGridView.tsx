import styled from "@emotion/styled";
import { GridCommand } from "../../../../../shared/commands/output-grid";
import { getRowKey, useGridDataWithColumns } from "../../useGridData";
import AVGrid from "../../../controls/AVGrid/AVGrid";
import { useCallback, useRef, useState } from "react";
import { CellFocus } from "../../../controls/AVGrid/avGridTypes";
import { Button } from "../../../controls/Button";
import { CloseIcon, OpenWindowIcon, SearchIcon } from "../../../theme/icons";
import { ViewMessage } from "../../../../../shared/ViewMessage";
import commands from "../../../../../shared/commands";
import { OutputDialog } from "../OutputDialog/OutputDialog";
import { OutputDialogHeader } from "../OutputDialog/OutputDialogHeader";
import { TextField } from "../../../controls/TextField";
import color from "../../../theme/color";
import { HighlightedTextProvider } from "../../../controls/useHighlightedText";
import { useGridSearchHeight } from "./useGridSearchHeight";

const CommandGridViewRoot = styled(OutputDialog)({
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

interface CommandGridViewProps {
    item: GridCommand;
    sendMessage: (message: ViewMessage) => void;
}

export function CommandGridView({
    item,
    sendMessage,
}: Readonly<CommandGridViewProps>) {
    const data = useGridDataWithColumns(item.data?.data, item.data?.columns);
    const [focus, setFocus] = useState<CellFocus | undefined>(undefined);
    const { search, setSearch, gridWrapperRef, gridWrapperHeight } =
        useGridSearchHeight();
    const searchRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (event.key === "f" && event.ctrlKey) {
            event.preventDefault();
            event.stopPropagation();
            if (searchRef.current) {
                searchRef.current.focus();
            }
        }
    }, []);

    return (
        <CommandGridViewRoot className="command-grid" onKeyDown={handleKeyDown} tabIndex={0}>
            <OutputDialogHeader title={item.data?.title}>
                <TextField
                    ref={searchRef}
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
                <Button
                    size="small"
                    type="icon"
                    title="Open in separate window"
                    onClick={() => {
                        sendMessage(
                            commands.window.showGrid({
                                data: item.data?.data ?? [],
                                title: item.data?.title,
                                columns: item.data?.columns,
                            })
                        );
                    }}
                >
                    <OpenWindowIcon />
                </Button>
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
                        focus={focus}
                        setFocus={setFocus}
                        growToHeight={400}
                        growToWidth="100%"
                        searchString={search}
                        disableFiltering
                    />
                </HighlightedTextProvider>
            </div>
        </CommandGridViewRoot>
    );
}
