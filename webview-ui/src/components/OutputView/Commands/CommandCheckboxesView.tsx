import styled from "@emotion/styled";
import { CheckboxesCommand, CheckboxesData } from "../../../../../shared/commands/input-checkboxes";
import { uiTextToString, ViewMessage } from "../../../../../shared/ViewMessage";
import { UiTextView } from "../UiTextView";
import { Button } from "../../../controls/Button";
import { CheckedIcon, UncheckedIcon } from "../../../theme/icons";
import { useCallback, useMemo } from "react";
import { OutputDialog } from "../OutputDialog/OutputDialog";
import { OutputDialogHeader } from "../OutputDialog/OutputDialogHeader";
import { OutputDialogButtons } from "../OutputDialog/OutputDialogButtons";

const CommandCheckboxesViewRoot = styled(OutputDialog)({
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
        <CommandCheckboxesViewRoot className="dialog-checkboxes">
            <OutputDialogHeader title={item.data?.title} />
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
            <OutputDialogButtons 
                buttons={item.data?.buttons}
                defaultButtons={["Proceed"]}
                resultButton={item.data?.resultButton}
                onClick={buttonClick}
            />
        </CommandCheckboxesViewRoot>
    );
}
