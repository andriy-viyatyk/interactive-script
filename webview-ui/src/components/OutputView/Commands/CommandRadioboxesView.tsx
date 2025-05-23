import styled from "@emotion/styled";
import { RadioboxesCommand, RadioboxesData } from "../../../../../shared/commands/input-radioboxes";
import { uiTextToString, ViewMessage } from "../../../../../shared/ViewMessage";
import { UiTextView } from "../UiTextView";
import { useCallback, useMemo } from "react";
import { Button } from "../../../controls/Button";
import { RadioCheckedIcon, RadioUncheckedIcon } from "../../../theme/icons";
import { OutputDialog } from "../OutputDialog/OutputDialog";
import { OutputDialogHeader } from "../OutputDialog/OutputDialogHeader";
import { OutputDialogButtons } from "../OutputDialog/OutputDialogButtons";

const CommandRadioboxesViewRoot = styled(OutputDialog)({
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    '& .radioboxes-container': {
        flex: '1 1 auto',
        overflowY: 'auto',
        padding: "4px 16px 4px 4px",
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: 8,
        rowGap: 4,
    }
});

interface CommandRadioboxesViewProps {
    item: RadioboxesCommand;
    replayMessage: (message: ViewMessage) => void;
    updateMessage: (message: ViewMessage) => void;
}

export function CommandRadioboxesView({
    item,
    replayMessage,
    updateMessage,
}: Readonly<CommandRadioboxesViewProps>) {
    const radioboxes = useMemo(
        () => item.data?.items || [],
        [item.data?.items]
    );

    const radioClick = (radio: string) => {
        const newItem = {
            ...item,
            data: {
                ...item.data,
                result: radio,
            },
        };
        updateMessage(newItem);
    };

    const buttonClick = useCallback(
        (button: string) => {
            const message = {
                ...item,
                data: {
                    ...item.data,
                    resultButton: button,
                } as RadioboxesData,
            };
            replayMessage(message);
            updateMessage(message);
        },
        [item, replayMessage, updateMessage]
    );

    return (
        <CommandRadioboxesViewRoot className="dialog-radioboxes" active={!item.data?.resultButton}>
            <OutputDialogHeader title={item.data?.title} />
            <div className="radioboxes-container" style={item.data?.bodyStyles}>
                {radioboxes.map((radio, index) => (
                    <Button
                        key={`${uiTextToString(radio)}-${index}`}
                        onClick={() => radioClick(uiTextToString(radio))}
                        size="small"
                        type="icon"
                        disabled={Boolean(item.data?.resultButton)}
                    >
                        {item.data?.result === uiTextToString(radio) ? (
                            <RadioCheckedIcon />
                        ) : (
                            <RadioUncheckedIcon />
                        )}
                        <UiTextView uiText={radio} />
                    </Button>
                ))}
            </div>
            <OutputDialogButtons 
                buttons={item.data?.buttons}
                defaultButtons={["!Proceed"]}
                resultButton={item.data?.resultButton}
                onClick={buttonClick}
                required={!item.data?.result}
                requiredHint="Select one of the options to proceed."
            />
        </CommandRadioboxesViewRoot>
    );
}
