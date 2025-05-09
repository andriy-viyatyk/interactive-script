import styled from "@emotion/styled";
import { ConfirmCommand } from "../../../../../shared/commands/input-confirm";
import color from "../../../theme/color";
import { ViewMessage } from "../../../../../shared/ViewMessage";
import { UiTextView } from "../UiTextView";
import { OutputDialog } from "../OutputDialog/OutputDialog";
import { OutputDialogHeader } from "../OutputDialog/OutputDialogHeader";
import { OutputDialogButtons } from "../OutputDialog/OutputDialogButtons";

const CommandConfirmViewRoot = styled(OutputDialog)({
    "& .message": {
        color: color.text.default,
        padding: 8,
        whiteSpace: "pre",
    },
});

interface CommandConfirmViewProps {
    item: ConfirmCommand;
    replayMessage: (message: ViewMessage) => void;
    updateMessage: (message: ViewMessage) => void;
}

export function CommandConfirmView({
    item,
    replayMessage,
    updateMessage,
}: Readonly<CommandConfirmViewProps>) {
    const buttonClick = (button: string) => {
        const message = { ...item, data: { ...item.data, result: button } };
        replayMessage(message);
        updateMessage(message);
    };

    return (
        <CommandConfirmViewRoot className="command-confirm" active={!item.data?.result}>
            <OutputDialogHeader title={item.data?.title} />
            <div className="message">
                <UiTextView uiText={item.data?.message} />
            </div>
            <OutputDialogButtons 
                buttons={item.data?.buttons}
                defaultButtons={["No", "Yes"]}
                resultButton={item.data?.result}
                onClick={buttonClick}
            />
        </CommandConfirmViewRoot>
    );
}
