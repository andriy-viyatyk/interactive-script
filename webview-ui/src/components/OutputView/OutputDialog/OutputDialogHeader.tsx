import styled from "@emotion/styled";
import color from "../../../theme/color";
import { UiTextView } from "../UiTextView";
import { UiText } from "../../../../../shared/ViewMessage";
import { FlexSpace } from "../../../controls/FlexSpace";

const OutputDialogHeaderRoot = styled.div({
    color: color.text.light,
    backgroundColor: color.background.dark,
    borderBottom: `1px solid ${color.border.default}`,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    padding: "4px 8px",
    display: "flex",
    alignItems: "center",
    columnGap: 8,
    "& button": {
        padding: "0 2px",
    },
    whiteSpace: "pre",
});

interface OutputDialogHeaderProps {
    title?: UiText;
    className?: string;
    children?: React.ReactNode;
}

export function OutputDialogHeader({
    title,
    className,
    children,
}: Readonly<OutputDialogHeaderProps>) {
    if (!title && !children) {
        return null;
    }

    return (
        <OutputDialogHeaderRoot className={className}>
            <UiTextView uiText={title} />
            <FlexSpace />
            {children}
        </OutputDialogHeaderRoot>
    );
}
