import styled from "@emotion/styled";
import { Button } from "../../../controls/Button";
import { UiText, uiTextToString } from "../../../../../shared/ViewMessage";
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
}

export function OutputDialogButtons({
    buttons: propsButtons,
    defaultButtons,
    className,
    resultButton,
    style,
    onClick,
}: Readonly<OutputDialogButtonsProps>) {
    const buttons = useMemo(() => {
        let btns = propsButtons || [];
        if (btns.length === 0) {
            btns = defaultButtons;
        }
        return btns;
    }, [propsButtons, defaultButtons]);

    return (
        <OutputDialogButtonsRoot className={clsx("dialog-buttons", className)} style={style}>
            {buttons.map((button, index) => (
                <Button
                    size="small"
                    key={`${uiTextToString(button)}-${index}`}
                    onClick={() => onClick(uiTextToString(button))}
                    disabled={Boolean(resultButton)}
                >
                    {resultButton === uiTextToString(button) ? (
                        <CheckIcon />
                    ) : null}
                    <UiTextView uiText={button} />
                </Button>
            ))}
        </OutputDialogButtonsRoot>
    );
}
