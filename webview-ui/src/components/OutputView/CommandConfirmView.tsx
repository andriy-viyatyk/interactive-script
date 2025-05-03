import styled from "@emotion/styled";
import { ConfirmCommand } from "../../../../shared/commands/input-confirm";
import { Button } from "../../controls/Button";
import color from "../../theme/color";
import { uiTextToString, ViewMessage } from "../../../../shared/ViewMessage";
import { CheckIcon } from "../../theme/icons";
import { UiTextView } from "./UiTextView";

const CommandConfirmViewRoot = styled.div({
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
    let buttons = item.data?.buttons || ["No", "Yes"];
    if (buttons.length === 0) {
        buttons = ["Ok"];
    }

    const buttonClick = (button: string) => {
        const message = { ...item, data: { ...item.data, result: button } };
        replayMessage(message);
        updateMessage(message);
    };

    return (
        <CommandConfirmViewRoot className="command-confirm dialog">
            {Boolean(item.data?.title) && (
                <div className="dialog-header">
                    <UiTextView uiText={item.data?.title} />
                </div>
            )}
            <div className="message">
                <UiTextView uiText={item.data?.message} />
            </div>
            <div className="dialog-buttons">
                {buttons.map((button, index) => (
                    <Button
                        size="small"
                        key={`${uiTextToString(button)}-${index}`}
                        onClick={() => buttonClick(uiTextToString(button))}
                        disabled={Boolean(item.data?.result)}
                    >
                        {item.data?.result === uiTextToString(button) ? <CheckIcon /> : null}
                        <UiTextView uiText={button} />
                    </Button>
                ))}
            </div>
        </CommandConfirmViewRoot>
    );
}
