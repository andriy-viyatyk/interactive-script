import styled from "@emotion/styled";
import { UiText } from "../../../../shared/ViewMessage";

const UiTextViewRoot = styled.span({
    display: "contents",
    whiteSpace: "pre-wrap",
});

export interface UiTextViewProps {
    uiText?: UiText;
    className?: string;
}

export function UiTextView({ uiText, className }: Readonly<UiTextViewProps>) {
    if (!uiText) return null;

    const renderText = (text: UiText): React.ReactNode => {
        if (typeof text === "string") {
            return text;
        } else if (Array.isArray(text)) {
            return text.map((item, index) => {
                if (typeof item === "string") {
                    return item;
                }
                return <span key={index} className="inner-span" style={item.styles}>
                    {item.text}
                </span>
            });
        } else {
            return (text as any)?.toString?.() ?? '';
        }
    };

    return <UiTextViewRoot className={className}>{renderText(uiText)}</UiTextViewRoot>;
}