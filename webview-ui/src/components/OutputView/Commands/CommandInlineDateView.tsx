import styled from "@emotion/styled";
import { OutputDialog } from "../OutputDialog/OutputDialog";
import { InlineDateInputCommand } from "../../../../../shared/commands/inline-date";
import { ViewMessage } from "../../../../../shared/ViewMessage";
import { UiTextView } from "../UiTextView";
import { OutputDialogButtons } from "../OutputDialog/OutputDialogButtons";
import { useItemState } from "../OutputViewContext";
import AsyncComponent from "../../../controls/AsyncComponent";
import color from "../../../theme/color";
import { useState } from "react";
import clsx from "clsx";
import { validDateOrNull } from "../../utils";

const CommandInlineDateRoot = styled(OutputDialog)({
    "& .react-datepicker": {
        border: `1px solid ${color.border.default}`,
    }
});

interface CommandInlineDateViewProps {
    item: InlineDateInputCommand;
    replayMessage: (message: ViewMessage) => void;
    updateMessage: (message: ViewMessage) => void;
    onCheckSize?: () => void;
}

export function CommandInlineDateView({
    item,
    replayMessage,
    updateMessage,
    onCheckSize,
}: Readonly<CommandInlineDateViewProps>) {
    const [date, setDate] = useItemState<Date | null>(
        item.commandId,
        "date",
        validDateOrNull(item.data?.result),
    );
    const [open, setOpen] = useState(false);

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
        <CommandInlineDateRoot className="inline inline-date-input">
            <UiTextView uiText={item.data?.title} />
            <div>
                <AsyncComponent
                    component={async () => {
                        const mod = await import("react-datepicker");
                        return mod.default;
                    }}
                    props={{
                        selected: date,
                        open,
                        onChange: (date: Date | null) => setDate(date),
                        onCalendarOpen: () => setOpen(true),
                        onCalendarClose: () => setOpen(false),
                        className: clsx({active: open || !item.data?.resultButton}),
                        disabled: Boolean(item.data?.resultButton),
                        popperPlacement: "bottom-start",
                    }}
                    onMount={onCheckSize}
                />
            </div>
            <OutputDialogButtons
                buttons={item.data?.buttons}
                defaultButtons={["!Proceed"]}
                resultButton={item.data?.resultButton}
                onClick={buttonClick}
                required={!date && !item.data?.resultButton}
                requiredHint="Select date to proceed."
                inline
            />
        </CommandInlineDateRoot>
    );
}