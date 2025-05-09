import styled from "@emotion/styled";
import { ButtonsCommand } from "../../../../../shared/commands/input-buttons";
import { ViewMessage } from "../../../../../shared/ViewMessage";
import { OutputDialog } from "../OutputDialog/OutputDialog";
import { OutputDialogButtons } from "../OutputDialog/OutputDialogButtons";

const CommandButtonsViewRoot = styled(OutputDialog)({
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    '&.this-buttons': {
        padding: "2px 4px",
    },
    "& .dialog-buttons": {
        padding: 0,
        margin: 0,
    },
    "& .dialog-buttons-container": {
        flex: "1 1 auto",
        overflowY: "auto",
        justifyContent: "flex-start",
    },
});

interface CommandButtonsViewProps {
    item: ButtonsCommand;
    replayMessage: (message: ViewMessage) => void;
    updateMessage: (message: ViewMessage) => void;
}

export function CommandButtonsView({
    item,
    replayMessage,
    updateMessage,
}: Readonly<CommandButtonsViewProps>) {
    const buttonClick = (button: string) => {
        const message = { ...item, data: { ...item.data, result: button } };
        replayMessage(message);
        updateMessage(message);
    };

    return (
        <CommandButtonsViewRoot className="dialog-buttons this-buttons" active={!item.data?.result}>
            <OutputDialogButtons
                className="dialog-buttons-container"
                buttons={item.data?.buttons}
                defaultButtons={["Proceed"]}
                resultButton={item.data?.result}
                onClick={buttonClick}
                style={item.data?.bodyStyles}
            />
        </CommandButtonsViewRoot>
    );
}
