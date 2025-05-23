import styled from "@emotion/styled";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

import { DateInputCommand } from "../../../../../shared/commands/input-date";
import { ViewMessage } from "../../../../../shared/ViewMessage";
import { OutputDialog } from "../OutputDialog/OutputDialog";
import { OutputDialogHeader } from "../OutputDialog/OutputDialogHeader";
import { OutputDialogButtons } from "../OutputDialog/OutputDialogButtons";
import color from "../../../theme/color";
import clsx from "clsx";
import { useItemState } from "../OutputViewContext";
import AsyncComponent from "../../../controls/AsyncComponent";

const CommandDateInputViewRoot = styled(OutputDialog)({
    "&.disabled .react-datepicker": {
        pointerEvents: "none",
        opacity: 0.8,
    },
    "& .react-datepicker": {
        backgroundColor: color.background.default,
        color: color.text.light,
        border: "none",
        fontFamily: "inherit",
        fontSize: "inherit",
    },
    "& .react-datepicker__navigation-icon::before": {
        borderColor: color.icon.light,
        borderWidth: "2px 2px 0 0",
    },
    "& .react-datepicker__navigation:hover *::before": {
        borderColor: color.icon.default,
    },
    "& .react-datepicker__current-month": {
        color: color.text.light,
    },
    "& .react-datepicker__header": {
        backgroundColor: color.background.default,
        borderColor: color.border.light,
    },
    "& .react-datepicker__day-name": {
        color: color.text.light,
        lineHeight: "1.1rem",
    },
    "& .react-datepicker__day": {
        color: color.text.light,
        lineHeight: "1.1rem",
    },
    "& .react-datepicker__day--today": {
        color: color.text.default,
    },
    "& .react-datepicker__day--keyboard-selected": {
        backgroundColor: "inherit",
    },
    "& .react-datepicker__day--selected": {
        color: color.text.selection,
        backgroundColor: color.background.selection,
    },
    "& .react-datepicker__day:hover": {
        outline: `1px solid ${color.border.default}`,
        backgroundColor: "inherit",
    },
    "& .react-datepicker__day:not(.react-datepicker__day--selected):hover": {
        outline: `1px solid ${color.border.default}`,
        backgroundColor: "inherit",
    },
    "& .react-datepicker__day--selected:hover": {
        backgroundColor: color.background.selection,
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
        null,
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
                    await import("react-datepicker/dist/react-datepicker.css");
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
