import styled from "@emotion/styled";
import { OutputDialog } from "../OutputDialog/OutputDialog";
import { SelectCommand } from "../../../../../shared/commands/input-select";
import { ViewMessage } from "../../../../../shared/ViewMessage";
import { UiTextView } from "../UiTextView";
import { OutputDialogButtons } from "../OutputDialog/OutputDialogButtons";
import { ComboSelect } from "../../../controls/ComboSelect";
import { useCallback } from "react";

const CommandSelectViewRoot = styled(OutputDialog)({
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    padding: "0 4px",
    columnGap: 8,
    border: "none",
    margin: 0,
    marginTop: 2,
});

interface CommandSelectViewProps {
    item: SelectCommand;
    replayMessage: (message: ViewMessage) => void;
    updateMessage: (message: ViewMessage) => void;
}

export function CommandSelectView({
    item,
    replayMessage,
    updateMessage,
}: Readonly<CommandSelectViewProps>) {
    const options = item.data?.options || [];

    const getLabel = useCallback((value: any) => {
        if (typeof value === "string") {
            return value;
        } else if (typeof value === "object" && value !== null) {
            return value[item.data?.labelKey || "label"] || "";
        }
        return "";
    }, [item.data?.labelKey]);

    const onSelect = useCallback((value: any) => {
        const newItem = {
            ...item,
            data: {
                ...item.data,
                result: value,
            },
        };
        updateMessage(newItem);
    }, [item, updateMessage]);

    const buttonClick = useCallback((button: string) => {
        const newItem = {
            ...item,
            data: {
                ...item.data,
                resultButton: button,
            },
        };
        updateMessage(newItem);
        replayMessage(newItem);
    }, [item, replayMessage, updateMessage]);

    return (
        <CommandSelectViewRoot>
            <UiTextView uiText={item.data?.label || ""} />
            <ComboSelect
                selectFrom={options}
                getLabel={getLabel}
                value={item.data?.result}
                onChange={onSelect}
                freeText={false}
                readonly={!!item.data?.resultButton}
                disabled={!!item.data?.resultButton}
                active={!item.data?.resultButton}
            />
            <OutputDialogButtons
                buttons={item.data?.buttons}
                defaultButtons={["!Proceed"]}
                resultButton={item.data?.resultButton}
                onClick={buttonClick}
                required={!item.data?.result}
                requiredHint="Select option to proceed."
                inline
            />
        </CommandSelectViewRoot>
    );
}
