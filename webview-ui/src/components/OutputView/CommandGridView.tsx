import styled from "@emotion/styled";
import { GridCommand } from "../../../../shared/commands/grid";
import { getRowKey, useGridDataWithColumns } from "../useGridData";
import AVGrid from "../../controls/AVGrid/AVGrid";
import { useState } from "react";
import { CellFocus } from "../../controls/AVGrid/avGridTypes";
import { FlexSpace } from "../../controls/FlexSpace";
import { Button } from "../../controls/Button";
import { OpenWindowIcon } from "../../theme/icons";
import { uiTextToString, ViewMessage } from "../../../../shared/ViewMessage";
import commands from "../../../../shared/commands";
import { UiTextView } from "./UiTextView";

const CommandGridViewRoot = styled.div({
    position: "relative",
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
        <CommandGridViewRoot className="command-grid dialog">
            <div className="dialog-header">
                <UiTextView uiText={item.data?.title} />
                <FlexSpace />
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
            </div>
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
