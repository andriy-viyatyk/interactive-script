import styled from "@emotion/styled";
import { ButtonsCommand } from "../../../../shared/commands/input-buttons";
import { uiTextToString, ViewMessage } from "../../../../shared/ViewMessage";
import { Button } from "../../controls/Button";
import { CheckIcon } from "../../theme/icons";
import { UiTextView } from "./UiTextView";

const CommandButtonsViewRoot = styled.div({
    '&.this-buttons': {
        padding: "2px 4px",
    }
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
    let buttons = item.data?.buttons || [];
    if (buttons.length === 0) {
        buttons = ["Proceed"];
    }

    const buttonClick = (button: string) => {
        const message = { ...item, data: { ...item.data, result: button } };
        replayMessage(message);
        updateMessage(message);
    };

    return (
        <CommandButtonsViewRoot className="dialog dialog-buttons this-buttons">
            {buttons.map((button, index) => (
                <Button
                    size="small"
                    key={`${uiTextToString(button)}-${index}`}
                    onClick={() => buttonClick(uiTextToString(button))}
                    disabled={Boolean(item.data?.result)}
                >
                    {item.data?.result === uiTextToString(button) ? (
                        <CheckIcon />
                    ) : null}
                    <UiTextView uiText={button} />
                </Button>
            ))}
        </CommandButtonsViewRoot>
    );
}
