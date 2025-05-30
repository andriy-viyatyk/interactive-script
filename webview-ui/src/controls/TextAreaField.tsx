import styled from "@emotion/styled";
import React, {
    ClipboardEventHandler,
    FormEvent,
    forwardRef,
    HTMLAttributes,
    useCallback,
    useImperativeHandle,
    useRef,
} from "react";

import color from "../theme/color";

const TextAreaRoot = styled.div(
    {
        padding: "4px 6px",
        backgroundColor: color.background.default,
        color: color.text.dark,
        border: "1px solid",
        borderColor: color.border.default,
        borderRadius: 4,
        outline: "none",
        boxSizing: "border-box",
        whiteSpace: "pre-wrap",
    },
    { label: "TextAreaRoot" }
);

interface TextAreaFieldProps
    extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "children"> {
    value?: string;
    onChange?: (value: string) => void;
    singleLine?: boolean;
    readonly?: boolean;
}

export interface TextAreaFieldRef {
    clear: () => void;
    reset: () => void;
    getText: () => string;
}

function innerTextToString(text: string): string {
    if (text === "\n") {
        return "";
    } else if (text.endsWith("\n")) {
        return text.slice(0, -1);
    }
    return text;
}

export const TextAreaField = forwardRef<TextAreaFieldRef, TextAreaFieldProps>(
    (props, ref) => {
        const { value, onChange, singleLine, readonly, ...divProps } = props;
        const textAreaRef = useRef<HTMLDivElement>(null);

        React.useEffect(() => {
            if (
                textAreaRef.current &&
                innerTextToString(textAreaRef.current.innerText) !== value
            ) {
                textAreaRef.current.innerText = value ?? "";
            }
        }, [value]);

        const handleInput = useCallback(
            (e: FormEvent<HTMLDivElement>) => {
                let text = e.currentTarget.innerText;
                if (singleLine && text.includes("\n")) {
                    text = text.replace(/\n/g, ""); // Remove line breaks
                    e.currentTarget.innerText = text; // Update the text content
                } else {
                    text = innerTextToString(text);
                }
                onChange?.(text);
            },
            [onChange, singleLine]
        );

        const handlePaste: ClipboardEventHandler<HTMLDivElement> = useCallback(
            (e) => {
                e.preventDefault();
                let text = e.clipboardData.getData("text/plain");
                if (singleLine) {
                    text = text.replace(/\n/g, ""); // Remove line breaks
                }

                // Insert text manually at caret position
                const selection = window.getSelection();
                if (!selection?.rangeCount) return;

                selection.deleteFromDocument();
                const textNode = document.createTextNode(text);
                selection.getRangeAt(0).insertNode(textNode);

                // Move caret after inserted text
                const range = document.createRange();
                range.setStartAfter(textNode);
                range.setEndAfter(textNode);
                selection.removeAllRanges();
                selection.addRange(range);

                onChange?.(textAreaRef.current?.innerText || "");
            },
            [onChange, singleLine]
        );

        const handleKeyDown = useCallback(
            (e: React.KeyboardEvent<HTMLDivElement>) => {
                if (singleLine && e.key === "Enter") {
                    e.preventDefault(); // Prevent adding new lines
                }
            },
            [singleLine]
        );

        useImperativeHandle(ref, () => ({
            clear: () => {
                if (textAreaRef.current) {
                    textAreaRef.current.innerText = "";
                    if (onChange) {
                        onChange("");
                    }
                }
            },
            reset: () => {
                if (textAreaRef.current) {
                    textAreaRef.current.innerText = value as string;
                }
            },
            getText: () => {
                return textAreaRef.current?.innerText || "";
            },
            div: textAreaRef.current,
        }));

        return (
            <TextAreaRoot
                ref={textAreaRef}
                onInput={handleInput}
                onPaste={handlePaste}
                onKeyDown={handleKeyDown}
                role="textarea"
                contentEditable={readonly ? false : "plaintext-only"}
                spellCheck={false}
                {...divProps}
                tabIndex={divProps.tabIndex ?? 0}
            />
        );
    }
);
