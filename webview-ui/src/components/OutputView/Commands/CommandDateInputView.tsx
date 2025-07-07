import styled from "@emotion/styled";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

import { DateInputCommand } from "../../../../../shared/commands/input-date";
import { ViewMessage } from "../../../../../shared/ViewMessage";
import { OutputDialog } from "../OutputDialog/OutputDialog";
import { OutputDialogHeader } from "../OutputDialog/OutputDialogHeader";
import { OutputDialogButtons } from "../OutputDialog/OutputDialogButtons";
import clsx from "clsx";
import { useItemState } from "../OutputViewContext";
import AsyncComponent from "../../../controls/AsyncComponent";
import { validDateOrNull } from "../../utils";

const CommandDateInputViewRoot = styled(OutputDialog)({
    "&.disabled .react-datepicker": {
        pointerEvents: "none",
        opacity: 0.8,
    },
});

interface CommandDateInputViewProps {
    item: DateInputCommand;
    replayMessage: (message: ViewMessage) => void;
    updateMessage: (message: ViewMessage) => void;
    onCheckSize?: () => void;
}

export function CommandDateInputView({
    item,
    replayMessage,
    updateMessage,
    onCheckSize,
}: Readonly<CommandDateInputViewProps>) {
    const [date, setDate] = useItemState<Date | null>(
        item.commandId,
        "date",
        validDateOrNull(item.data?.result),
    );
    const disabled = Boolean(item.data?.resultButton);

    const buttonClick = (button: string) => {
        const message = {
            ...item,
            data: {
                ...item.data,
                result: date?.toISOString() ?? undefined,
                resultButton: button,
            },
        };
        replayMessage(message);
        updateMessage(message);
    };

    return (
        <CommandDateInputViewRoot
            className={clsx("command-date-input", { disabled })}
            active={!disabled}
        >
            <OutputDialogHeader title={item.data?.title} />
            <AsyncComponent
                component={async () => {
                    const mod = await import("react-datepicker");
                    return mod.default;
                }}
                props={{
                    selected: date,
                    onChange: (date: Date | null) => setDate(date),
                    inline: true,
                }}
                onMount={onCheckSize}
            />
            <OutputDialogButtons
                buttons={item.data?.buttons}
                defaultButtons={["!Proceed"]}
                resultButton={item.data?.resultButton}
                onClick={buttonClick}
                required={!date}
                requiredHint="Please select a date"
            />
        </CommandDateInputViewRoot>
    );
}
