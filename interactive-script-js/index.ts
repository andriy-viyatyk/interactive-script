import commands from "../shared/commands";
import { isUiText, UiText } from "../shared/ViewMessage";
import { ConfirmCommand, ConfirmData } from "../shared/commands/input-confirm";
import { GridColumn } from "../shared/commands/output-grid";
import { TextInputCommand, TextInputData } from "../shared/commands/input-text";
import { ButtonsCommand } from "../shared/commands/input-buttons";
import { send, responseHandler } from "./src/handlers";
import { Progress } from "./src/objects/Progress";
import {
    StyledLogCommand,
    styledText,
    StyledText,
} from "./src/objects/StyledText";
import { namedColors } from "./src/objects/StyledTextColor";
import { CheckboxesCommand, CheckboxesData } from "../shared/commands/input-checkboxes";

const ui = {
    text: (message: UiText) =>
        new StyledLogCommand(send(commands.log.text(message))),
    log: (message: UiText) =>
        new StyledLogCommand(send(commands.log.log(message))),
    error: (message: UiText) =>
        new StyledLogCommand(send(commands.log.error(message))),
    info: (message: UiText) =>
        new StyledLogCommand(send(commands.log.info(message))),
    warn: (message: UiText) =>
        new StyledLogCommand(send(commands.log.warn(message))),
    success: (message: UiText) =>
        new StyledLogCommand(send(commands.log.success(message))),
    clear: () => send(commands.clear()),
    dialog: {
        buttons: async (buttons: UiText[]) => {
            const message = commands.buttons({ buttons });
            const response = await responseHandler.send(message);
            if (response) {
                return (response as ButtonsCommand).data?.result;
            } else {
                return undefined;
            }
        },

        confirm: async (params: UiText | ConfirmData) => {
            const message = isUiText(params)
                ? commands.confirm({ message: params })
                : commands.confirm(params);
            const response = await responseHandler.send(message);
            if (response) {
                return (response as ConfirmCommand).data?.result;
            } else {
                return undefined;
            }
        },

        textInput: async (params: UiText | TextInputData) => {
            const message = isUiText(params)
                ? commands.textInput({ title: params })
                : commands.textInput(params);
            const response = await responseHandler.send(message);
            if (response) {
                return (response as TextInputCommand).data;
            } else {
                return undefined;
            }
        },

        checkboxes: async (params: UiText[] | CheckboxesData) => {
            const message = Array.isArray(params)
                ? commands.checkboxes({ items: params.map((item) => ({ label: item })) })
                : commands.checkboxes(params);
            const response = await responseHandler.send(message);
            if (response) {
                return (response as CheckboxesCommand).data;
            } else {
                return undefined;
            }
        }

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

export { Progress, StyledText, styledText, namedColors };
