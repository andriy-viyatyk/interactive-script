import styled from "@emotion/styled";
import { TextAreaField } from "../../controls/TextAreaField";
import { useCallback, useState } from "react";
import color from "../../theme/color";
import { FlexSpace } from "../../controls/FlexSpace";
import { Button } from "../../controls/Button";
import { ViewMessage } from "../../../../shared/ViewMessage";
import { v4 } from "uuid";

const TestConsoleRoot = styled.div({
    height: "40%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    borderTop: `1px solid ${color.border.default}`,
    flexShrink: 0,
    '& .test-console-header': {
        backgroundColor: color.background.light,
        borderBottom: `1px solid ${color.border.default}`,
        display: "flex",
        flexDirection: "row",
        padding: 4,
    },
    '& .test-console-textarea': {
        flex: '1 1 auto',
        padding: 4,
        overflow: "auto",
    },
});

export function TestConsole() {
    const [text, setText] = useState(localStorage.getItem('test-console-text') || '');

    const setTextProxy = useCallback((text: string) => {
        setText(text);
        localStorage.setItem('test-console-text', text);
    }, []);

    const sendClick = useCallback(() => {
        const messages = JSON.parse(text) as ViewMessage[];
        messages.forEach((message) => {
            message.commandId = v4();
            window.postMessage(message, "*");
        });
    }, [text]);

    return (
        <TestConsoleRoot>
            <div className="test-console-header">
                <FlexSpace />
                <Button type="icon" onClick={sendClick}>Send</Button>
            </div>
            <TextAreaField 
                onChange={setTextProxy}
                className="test-console-textarea"
                value={text}
            />
        </TestConsoleRoot>
    );
}
