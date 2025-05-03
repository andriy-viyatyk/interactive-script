import commands from "../shared/commands";
import { isUiText, UiText } from "../shared/ViewMessage";
import { ConfirmCommand, ConfirmData } from "../shared/commands/input-confirm";
import { GridColumn } from "../shared/commands/output-grid";
import { TextInputCommand, TextInputData } from "../shared/commands/input-text";
import { ButtonsCommand } from "../shared/commands/input-buttons";
import { send, withResponse } from "./src/handlers";
import { Progress } from "./src/objects/Progress";

const ui = {
    log: (message: UiText) => send(commands.log.log(message)),
    error: (message: UiText) => send(commands.log.error(message)),
    info: (message: UiText) => send(commands.log.info(message)),
    warn: (message: UiText) => send(commands.log.warn(message)),
    success: (message: UiText) => send(commands.log.success(message)),
    clear: () => send(commands.clear()),
    dialog: {
        buttons: async (buttons: UiText[]) => {
            const message = commands.buttons({ buttons });
            const response = await withResponse(message);
            if (response) {
                return (response as ButtonsCommand).data?.result;
            } else {
                return undefined;
            }
        },

        confirm: async (params: UiText | ConfirmData) => {
            const message =
                isUiText(params)
                    ? commands.confirm({ message: params })
                    : commands.confirm(params);
            const response = await withResponse(message);
            if (response) {
                return (response as ConfirmCommand).data?.result;
            } else {
                return undefined;
            }
        },

        textInput: async (params: UiText | TextInputData) => {
            const message =
                isUiText(params)
                    ? commands.textInput({ title: params })
                    : commands.textInput(params);
            const response = await withResponse(message);
            if (response) {
                return (response as TextInputCommand).data;
            } else {
                return undefined;
            }
        },
    },
    display: {
        gridFromJsonArray: (
            data: any[],
            options?: { title?: UiText; columns?: GridColumn[] }
        ) => send(commands.grid.fromJsonArray(data, options)),

        textBlock: (data: string, options?: { title?: string }) =>
            send(commands.text({ text: data, title: options?.title })),

        progress: (label: UiText, max?: number, value?: number) => 
            new Progress(send(commands.progress({ label, max, value }))),
    },
    window: {
        showGrid: (
            data: any[],
            options?: { title?: string; columns?: GridColumn[] }
        ) => send(commands.window.showGrid({ data, ...options })),

        showText: (text: string, options?: { language?: string }) =>
            send(commands.window.showText({ text, ...options })),
    },
};

export default ui;

export { Progress };
