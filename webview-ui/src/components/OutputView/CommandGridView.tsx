import styled from "@emotion/styled";
import { GridCommand } from "../../../../shared/commands/grid";
import { getRowKey, useGridDataWithColumns } from "../useGridData";
import AVGrid from "../../controls/AVGrid/AVGrid";
import { useState } from "react";
import { CellFocus } from "../../controls/AVGrid/avGridTypes";
import color from "../../theme/color";
import { FlexSpace } from "../../controls/FlexSpace";
import { Button } from "../../controls/Button";
import { OpenWindowIcon } from "../../theme/icons";
import { ViewMessage } from "../../../../shared/ViewMessage";
import commands from "../../../../shared/commands";

const CommandGridViewRoot = styled.div({
    margin: "4px 0",
    marginLeft: 20,
    padding: 4,
    border: `1px solid ${color.border.default}`,
    borderRadius: 4,
    // maxWidth: "calc(100% - 50px)",
    position: "relative",
    "& .title": {
        color: color.text.light,
        backgroundColor: color.background.dark,
        borderBottom: `1px solid ${color.border.default}`,
        paddingBottom: 4,
        display: "flex",
        alignItems: "center",
        "& button": {
            padding: 0,
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

    return (
        <CommandGridViewRoot className="command-grid">
            <div className="title">
                {item.data?.title}
                <FlexSpace />
                <Button
                    size="small"
                    type="icon"
                    title="Open in separate window"
                    onClick={() => {
                        sendMessage(
                            commands.window.showGrid(item.data?.data ?? [], {
                                title: item.data?.title,
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
