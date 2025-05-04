import styled from "@emotion/styled";
import { CheckboxesCommand, CheckboxesData } from "../../../../shared/commands/input-checkboxes";
import { uiTextToString, ViewMessage } from "../../../../shared/ViewMessage";
import { UiTextView } from "./UiTextView";
import { Button } from "../../controls/Button";
import { CheckedIcon, CheckIcon, UncheckedIcon } from "../../theme/icons";
import { useCallback, useMemo } from "react";

const CommandCheckboxesViewRoot = styled.div({
    maxHeight: 400,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    '& .checkboxes-container': {
        flex: '1 1 auto',
        overflowY: 'auto',
        padding: "4px 16px 4px 4px",
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: 8,
        rowGap: 4,
    }
});

interface CommandCheckboxesViewProps {
    item: CheckboxesCommand;
    replayMessage: (message: ViewMessage) => void;
    updateMessage: (message: ViewMessage) => void;
}

export function CommandCheckboxesView({
    item,
    replayMessage,
    updateMessage,
}: Readonly<CommandCheckboxesViewProps>) {
    let buttons = item.data?.buttons || [];
    if (buttons.length === 0) {
        buttons = ["Proceed"];
    }

    const checkboxes = useMemo(() => item.data?.items || [], [item.data?.items]);

    const checkboxClick = useCallback(
        (index: number) => {
            const newCheckboxes = [...checkboxes];
            newCheckboxes[index] = {
                ...newCheckboxes[index],
                checked: !newCheckboxes[index].checked,
            };
            const message = {
                ...item,
                data: { ...item.data, items: newCheckboxes },
            };
            updateMessage(message);
        },
        [checkboxes, item, updateMessage]
    );

    const buttonClick = useCallback(
        (button: string) => {
            const message = {
                ...item,
                data: {
                    ...item.data,
                    resultButton: button,
                    result: item.data?.items.filter((i) => i.checked).map((i) => i.label),
                } as CheckboxesData,
            };
            replayMessage(message);
            updateMessage(message);
        },
        [item, replayMessage, updateMessage]
    );

    return (
        <CommandCheckboxesViewRoot className="dialog dialog-checkboxes">
            {Boolean(item.data?.title) && (
                <div className="dialog-header">
                    <UiTextView uiText={item.data?.title} />
                </div>
            )}
            <div className="checkboxes-container" style={item.data?.bodyStyles}>
                {checkboxes.map((checkbox, index) => (
                    <Button
                        key={`${uiTextToString(checkbox.label)}-${index}`}
                        onClick={() => checkboxClick(index)}
                        size="small"
                        type="icon"
                        disabled={Boolean(item.data?.resultButton)}
                    >
                        {checkbox.checked ? <CheckedIcon /> : <UncheckedIcon />}
                        <UiTextView uiText={checkbox.label} />
                    </Button>
                ))}
            </div>
            <div className="dialog-buttons">
                {buttons.map((button, index) => (
                    <Button
                        size="small"
                        key={`${uiTextToString(button)}-${index}`}
                        onClick={() => buttonClick(uiTextToString(button))}
                        disabled={Boolean(item.data?.resultButton)}
                    >
                        {item.data?.resultButton === uiTextToString(button) ? (
                            <CheckIcon />
                        ) : null}
                        <UiTextView uiText={button} />
                    </Button>
                ))}
            </div>
        </CommandCheckboxesViewRoot>
    );
}
