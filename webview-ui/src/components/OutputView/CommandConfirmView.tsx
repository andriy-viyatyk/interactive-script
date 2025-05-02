import styled from "@emotion/styled";
import { ConfirmCommand } from "../../../../shared/commands/confirm";
import { Button } from "../../controls/Button";
import color from "../../theme/color";
import { ViewMessage } from "../../../../shared/ViewMessage";
import { CheckIcon } from "../../theme/icons";

const CommandConfirmViewRoot = styled.div({
    margin: "4px 0",
    border: `1px solid ${color.border.default}`,
    borderRadius: 4,
    "& .message": {
        color: color.text.default,
        padding: 8,
        whiteSpace: "pre",
    },
    "& .buttons": {
        display: "flex",
        flexDirection: "row",
        columnGap: 8,
        justifyContent: "flex-end",
        flexWrap: "wrap",
        padding: 4,
        paddingBottom: 0,
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
    let buttons = item.data?.buttons || ["Yes", "No"];
    if (buttons.length === 0) {
        buttons = ["OK"];
    }

    const buttonClick = (button: string) => {
        const message = { ...item, data: { ...item.data, result: button } };
        replayMessage(message);
        updateMessage(message);
    };

    return (
        <CommandConfirmViewRoot className="command-confirm">
            {Boolean(item.data?.title) && <div className="dialog-header">{item.data?.title}</div>}
            <div className="message">{item.data?.message}</div>
            <div className="buttons">
                {buttons.map((button, index) => (
                    <Button
                        size="small"
                        key={`${button}-${index}`}
                        onClick={() => buttonClick(button)}
                        disabled={Boolean(item.data?.result)}
                    >
                        {(item.data?.result === button ? <CheckIcon /> : null)}{button}
                    </Button>
                ))}
            </div>
        </CommandConfirmViewRoot>
    );
}
