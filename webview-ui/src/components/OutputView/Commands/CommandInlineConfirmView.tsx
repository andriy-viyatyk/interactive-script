import styled from "@emotion/styled";
import { OutputDialog } from "../OutputDialog/OutputDialog";
import { InlineConfirmCommand } from "../../../../../shared/commands/inline-confirm";
import { UiTextView } from "../UiTextView";
import { OutputDialogButtons } from "../OutputDialog/OutputDialogButtons";

const CommandInlineConfirmViewRoot = styled(OutputDialog)({});

interface CommandInlineConfirmViewProps {
    item: InlineConfirmCommand;
    replayMessage: (message: any) => void;
    updateMessage: (message: any) => void;
}

export function CommandInlineConfirmView({
    item,
    replayMessage,
    updateMessage,
}: Readonly<CommandInlineConfirmViewProps>) {

    const buttonClick = (button: string) => {
        const message = { ...item, data: { ...item.data, result: button } };
        replayMessage(message);
        updateMessage(message);
    };

    return (
        <CommandInlineConfirmViewRoot className="inline command-inline-confirm" active={!item.data?.result}>
            <UiTextView uiText={item.data?.message} />
            <OutputDialogButtons
                buttons={item.data?.buttons}
                defaultButtons={["No", "Yes"]}
                resultButton={item.data?.result}
                onClick={buttonClick}
                inline
            />
        </CommandInlineConfirmViewRoot>
    );

}