import { useEffect } from "react";
import { TModel } from "../../common/classes/model";
import { TGlobalState } from "../../common/classes/state";
import styled from "@emotion/styled";
import color from "../../theme/color";
import { ViewMessage } from "../../../../shared/ViewMessage";
import { TestConsole } from "./TestConsole";
import { OutputItemList } from "./OutputItemList";
import { v4 } from "uuid";

const OutputRoot = styled.div({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    backgroundColor: color.vs.background,
    color: color.vs.gray2,
    padding: 4,
});

const defaultOutputViewState = {
    items: [] as ViewMessage[],
};

type OutputViewState = typeof defaultOutputViewState;

class OutputViewModel extends TModel<OutputViewState> {
    onWindowMessage = (event: MessageEvent<any>) => {
        const message = event.data as ViewMessage;
        if (message?.command) {
            switch (message.command) {
                case "clear":
                    this.state.update((state) => {
                        state.items = [];
                    });
                    return;
                default:
                    this.state.update((state) => {
                        state.items.push(message);
                    });
                    break;
            }
        }
    };

    sendMessage = (message: ViewMessage) => {
        window.vscode.postMessage(message);
    }

    replayMessage = (message: ViewMessage) => {
        const replayMessage = { ...message, isResponse: true };
        if (!window.vscode) {
            this.state.update((s) => {
                s.items.push({
                    commandId: v4(),
                    command: "error",
                    data: "Replay message failed: no vscode object",
                });
            });
        } else {
            window.vscode.postMessage(replayMessage);
        }
    };

    updateMessage = (message: ViewMessage) => {
        this.state.update((s) => {
            s.items = s.items.map((item) => {
                if (item.commandId === message.commandId) {
                    return message;
                }
                return item;
            });
        });
    };
}

const model = new OutputViewModel(new TGlobalState(defaultOutputViewState));

export function OutputView() {
    const state = model.state.use();

    useEffect(() => {
        window.addEventListener("message", model.onWindowMessage);

        return () => {
            window.removeEventListener("message", model.onWindowMessage);
        };
    }, []);

    return (
        <OutputRoot>
            <OutputItemList
                items={state.items}
                replayMessage={model.replayMessage}
                updateMessage={model.updateMessage}
                sendMessage={model.sendMessage}
            />
            {Boolean(window.isDebug) && <TestConsole />}
        </OutputRoot>
    );
}
