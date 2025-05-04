import styled from "@emotion/styled";
import { GridCommand } from "../../../../../shared/commands/output-grid";
import { getRowKey, useGridDataWithColumns } from "../../useGridData";
import AVGrid from "../../../controls/AVGrid/AVGrid";
import { useState } from "react";
import { CellFocus } from "../../../controls/AVGrid/avGridTypes";
import { Button } from "../../../controls/Button";
import { OpenWindowIcon } from "../../../theme/icons";
import { uiTextToString, ViewMessage } from "../../../../../shared/ViewMessage";
import commands from "../../../../../shared/commands";
import { OutputDialog } from "../OutputDialog/OutputDialog";
import { OutputDialogHeader } from "../OutputDialog/OutputDialogHeader";

const CommandGridViewRoot = styled(OutputDialog)({
    position: "relative",
    maxHeight: "unset",
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

    return (
        <CommandGridViewRoot className="command-grid">
            <OutputDialogHeader title={item.data?.title}>
                <Button
                    size="small"
                    type="icon"
                    title="Open in separate window"
                    onClick={() => {
                        sendMessage(
                            commands.window.showGrid({
                                data: item.data?.data ?? [],
                                title: uiTextToString(item.data?.title),
                                columns: item.data?.columns,
                            })
                        );
                    }}
                >
                    <OpenWindowIcon />
                </Button>
            </OutputDialogHeader>
            <AVGrid
                columns={data.columns}
                rows={data.rows}
                getRowKey={getRowKey}
                focus={focus}
                setFocus={setFocus}
                grawToHeight={400}
                grawToWidth="100%"
            />
        </CommandGridViewRoot>
    );
}
