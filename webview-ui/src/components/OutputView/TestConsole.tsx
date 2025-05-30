import styled from "@emotion/styled";
import { TextAreaField } from "../../controls/TextAreaField";
import { useCallback, useState } from "react";
import color from "../../theme/color";
import { FlexSpace } from "../../controls/FlexSpace";
import { Button } from "../../controls/Button";
import { newMessage, ViewMessage } from "../../../../shared/ViewMessage";
import { v4 } from "uuid";
import clsx from "clsx";

const TestConsoleRoot = styled.div({
    height: "40%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    borderTop: `1px solid ${color.border.default}`,
    flexShrink: 0,
    "&.hidden": {
        height: 30,
        flexGrow: 0,
    },
    '& .test-console-header': {
        backgroundColor: color.background.light,
        borderBottom: `1px solid ${color.border.default}`,
        display: "flex",
        flexDirection: "row",
        padding: 4,
        columnGap: 8,
    },
    '& .test-console-textarea': {
        flex: '1 1 auto',
        padding: 4,
        overflow: "auto",
    },
});

export function TestConsole() {
    const [text, setText] = useState(localStorage.getItem('test-console-text') || '');
    const [hidden, setHidden] = useState(false);

    const setTextProxy = useCallback((text: string) => {
        setText(text);
        localStorage.setItem('test-console-text', text);
    }, []);

    const sendClick = useCallback(() => {
        const messages = JSON.parse(text) as ViewMessage[];
        messages.forEach((message) => {
            message.commandId = message.commandId ?? v4();
            window.postMessage(message, "*");
        });
    }, [text]);

    const clearClick = useCallback(() => {
        const message = newMessage("clear", {});
        window.postMessage(message, "*");
    }, []);

    const toggleHidden = useCallback(() => {
        setHidden((prev) => !prev);
    }, []);

    return (
        <TestConsoleRoot className={clsx("test-console", { hidden })}>
            <div className="test-console-header">
                <Button size="mini" onClick={toggleHidden}>{hidden ? "Expand" : "Collapse"}</Button>
                <FlexSpace />
                <Button size="mini" onClick={clearClick}>Clear</Button>
                <Button size="mini" onClick={sendClick}>Send</Button>
            </div>
            {!hidden && (
                <TextAreaField
                    onChange={setTextProxy}
                    className="test-console-textarea"
                    value={text}
                />
            )}
        </TestConsoleRoot>
    );
}
