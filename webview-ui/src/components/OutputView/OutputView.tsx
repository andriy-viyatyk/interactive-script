import { SetStateAction, useEffect, useMemo } from "react";
import { TModel } from "../../common/classes/model";
import { TComponentState, TGlobalState } from "../../common/classes/state";
import styled from "@emotion/styled";
import color from "../../theme/color";
import { ViewMessage } from "../../../../shared/ViewMessage";
import { TestConsole } from "./TestConsole";
import { OutputItemList } from "./OutputItemList";
import { v4 } from "uuid";
import { GlobalRoot } from "../GlobalRoot";
import commands from "../../../../shared/commands";
import { isGridEditorCommand } from "../../../../shared_internal/grid-editor-commands";
import { FlexSpace } from "../../controls/FlexSpace";
import { Button } from "../../controls/Button";
import { ARightIcon, ClearConsoleIcon, StopIcon } from "../../theme/icons";
import { OutputViewProvider, UseComponentStateFn, UseItemStateFn } from "./OutputViewContext";
import { resolveState } from "../../common/utils/utils";
import { responseHandler } from "../responseHandler";

const OutputRoot = styled(GlobalRoot)({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    backgroundColor: color.background.default,
    color: color.text.light,
    padding: 4,
    "& .output-header": {
        flexShrink: 0,
        backgroundColor: color.background.dark,
        borderBottom: `1px solid ${color.border.light}`,
        display: "flex",
        alignItems: "center",
        padding: "0 4px 2px 4px",
        columnGap: 4,
    },
});

const defaultOutputViewState = {
    items: [] as ViewMessage[],
    itemsState: {} as Record<string, Record<string, any>>,
    isRunning: false,
};

type OutputViewState = typeof defaultOutputViewState;

class OutputViewModel extends TModel<OutputViewState> {
    private componentStates: Map<string, TComponentState<any>> = new Map();

    onWindowMessage = (event: MessageEvent<any>) => {
        const message = event.data as ViewMessage;
        if (message?.command) {
            if (isGridEditorCommand(message)) {
                return;
            }

            if (responseHandler.handleResponse(message)) {
                return;
            }

            if (isGridEditorCommand(message)) {
                return;
            }

            switch (message.command) {
                case "ping":
                    this.replayMessage(message);
                    return;
                case "clear":
                    this.clearConsole();
                    return;
                case "script.start":
                    this.state.update((state) => {
                        state.isRunning = true;
                    });
                    return;
                case "script.stop":
                    this.state.update((state) => {
                        state.isRunning = false;
                    });
                    return;
                default:
                    this.state.update((state) => {
                        const existingIndex = state.items.findIndex(
                            (item) => item.commandId === message.commandId
                        );
                        if (existingIndex >= 0) {
                            state.items[existingIndex] = message;
                        } else {
                            state.items.push(message);
                        }
                    });
                    break;
            }
        }
    };

    clearConsole = () => {
        this.state.update((state) => {
            state.items = [];
            state.itemsState = {};
        });
        this.componentStates.clear();
    };

    sendMessage = (message: ViewMessage) => {
        window.vscode.postMessage(message);
    };

    replayMessage = (message: ViewMessage) => {
        const replayMessage = { ...message, isResponse: true };
        if (!window.vscode) {
            this.state.update((s) => {
                s.items.push({
                    commandId: v4(),
                    command: "log.error",
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

    toggleScriptRunning = () => {
        const isRunning = this.state.get().isRunning;
        if (isRunning) {
            this.sendMessage(commands.script.stop());
        } else {
            const filePath = window.appInput?.outputInput?.filePath;
            if (filePath) {
                this.sendMessage(commands.script.start(filePath));
                this.state.update((state) => {
                    state.isRunning = true;
                });
            }
        }
    };

    // this hook should be used only inside the component
    useItemState: UseItemStateFn<any> = (itemId: string, stateName: string, defaultState: any) => {
        const currentState = this.state.use(s => {
            const value = s.itemsState[itemId]?.[stateName];
            return value ?? defaultState;
        })

        const setState = (value: SetStateAction<any>) => {
            this.state.update((state) => {
                const resolved = resolveState(value, () => state.itemsState[itemId]?.[stateName]);
                if (!state.itemsState[itemId]) {
                    state.itemsState[itemId] = {};
                }
                state.itemsState[itemId][stateName] = resolved;
            });
        };
        return [currentState, setState];
    }

    useComponentState: UseComponentStateFn<any> = (itemId: string, defaultState: any) => {
        const state = this.componentStates.get(itemId);
        if (state) {
            return state;
        }
        const newState = new TComponentState(defaultState);
        this.componentStates.set(itemId, newState);
        return newState;
    }
}

const model = new OutputViewModel(new TGlobalState(defaultOutputViewState));

export default function OutputView() {
    const state = model.state.use();
    const data = window.appInput?.outputInput ?? {};
    const { title = "", filePath = "", withHeader = false } = data;

    useEffect(() => {
        window.addEventListener("message", model.onWindowMessage);
        model.sendMessage(commands.viewReady());

        return () => {
            window.removeEventListener("message", model.onWindowMessage);
        };
    }, []);

    const context = useMemo(() => ({ 
        useItemState: model.useItemState,
        useComponentState: model.useComponentState
    }), []);

    return (
        <OutputRoot>
            {Boolean(withHeader) && (
                <div className="output-header">
                    <div title={filePath}>{title}</div>
                    <FlexSpace />
                    <Button
                        type="flat"
                        size="small"
                        title={state.isRunning ? "Stop" : "Run"}
                        onClick={model.toggleScriptRunning}
                    >
                        {state.isRunning ? <StopIcon /> : <ARightIcon />}
                    </Button>
                    <Button type="flat" size="small" title="Clear Console" onClick={model.clearConsole}>
                        <ClearConsoleIcon />
                    </Button>
                </div>
            )}
            <OutputViewProvider context={context}>
            <OutputItemList
                items={state.items}
                replayMessage={model.replayMessage}
                updateMessage={model.updateMessage}
                sendMessage={model.sendMessage}
            />
            </OutputViewProvider>
            {Boolean(window.isDebug) && <TestConsole />}
        </OutputRoot>
    );
}
