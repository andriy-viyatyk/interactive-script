import styled from "@emotion/styled";
import { Button } from "../../../controls/Button";
import { TextWithStyle, UiText, uiTextToString } from "../../../../../shared/ViewMessage";
import { CheckIcon } from "../../../theme/icons";
import { UiTextView } from "../UiTextView";
import { useMemo } from "react";
import clsx from "clsx";

const OutputDialogButtonsRoot = styled.div({
    display: "flex",
    flexDirection: "row",
    columnGap: 8,
    alignItems: "center",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    padding: 4,
    paddingBottom: 0,
    marginBottom: 4,
});

interface OutputDialogButtonsProps {
    buttons?: UiText[];
    defaultButtons: string[];
    className?: string;
    resultButton?: string;
    onClick: (button: string) => void;
    style?: React.CSSProperties;
    required?: boolean;
    requiredHint?: string;
}

function useButtons(btns: UiText[] | undefined, defaultButtons: string[]) {
    return useMemo(() => {
        let buttons = btns || [];
        if (buttons.length === 0) {
            buttons = defaultButtons;
        }
        return buttons.map((button) => {
            let required = false;
            let newButton: UiText;
            if (typeof button === "string") {
                if (button.startsWith("!")) {
                    required = true;
                    newButton = button.substring(1);
                } else {
                    newButton = button;
                }
            } else if (Array.isArray(button)) {
                const firstBlock = button[0];
                if (typeof firstBlock === "string") {
                    if (firstBlock.startsWith("!")) {
                        required = true;
                        newButton = [firstBlock.substring(1), ...button.slice(1)];
                    } else {
                        newButton = button;
                    }
                } else if (
                    typeof firstBlock === "object" &&
                    firstBlock !== null &&
                    "text" in firstBlock
                ) {
                    if (firstBlock.text.startsWith("!")) {
                        required = true;
                        const updatedFirstBlock: TextWithStyle = {
                            ...firstBlock,
                            text: firstBlock.text.substring(1),
                        };
                        newButton = [updatedFirstBlock, ...button.slice(1)];
                    } else {
                        newButton = button;
                    }
                } else {
                    newButton = button;
                }
            } else {
                newButton = button;
            }

            return { button: newButton, required };
        });
    }, [btns, defaultButtons]);
}

export function OutputDialogButtons({
    buttons: propsButtons,
    defaultButtons,
    className,
    resultButton,
    style,
    onClick,
    required,
    requiredHint,
}: Readonly<OutputDialogButtonsProps>) {
    const buttons = useButtons(propsButtons, defaultButtons);

    return (
        <OutputDialogButtonsRoot
            className={clsx("dialog-buttons", className)}
            style={style}
        >
            {buttons.map((button, index) => (
                <Button
                    size="small"
                    key={`${uiTextToString(button.button)}-${index}`}
                    onClick={() => onClick(uiTextToString(button.button))}
                    disabled={Boolean(resultButton) || (required && button.required)}
                    title={required && button.required ? requiredHint : undefined}
                >
                    {resultButton === uiTextToString(button.button) ? (
                        <CheckIcon />
                    ) : null}
                    <UiTextView uiText={button.button} />
                </Button>
            ))}
        </OutputDialogButtonsRoot>
    );
}
