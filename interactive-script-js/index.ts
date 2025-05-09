import commands from "../shared/commands";
import { isUiText, UiText } from "../shared/ViewMessage";
import { ConfirmCommand, ConfirmData } from "../shared/commands/input-confirm";
import { GridColumn, GridData } from "../shared/commands/output-grid";
import { TextInputCommand, TextInputData } from "../shared/commands/input-text";
import { ButtonsCommand, ButtonsData } from "../shared/commands/input-buttons";
import { send, responseHandler } from "./src/handlers";
import { Progress } from "./src/objects/Progress";
import {
    StyledLogCommand,
    styledText,
    StyledText,
} from "./src/objects/StyledText";
import { namedColors } from "./src/objects/StyledTextColor";
import { CheckboxesCommand, CheckboxesData } from "../shared/commands/input-checkboxes";
import { RadioboxesCommand, RadioboxesData } from "../shared/commands/input-radioboxes";
import { TextData } from "../shared/commands/output-text";
import { SelectRecordCommand, SelectRecordData } from "../shared/commands/input-selectRecord";
import { ProgressData } from "../shared/commands/output-progress";
import { WindowGridData, WindowTextData } from "../shared/commands/window";

const ui = {
    ping: () => responseHandler.send(commands.ping()),
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
        buttons: async (buttons: UiText[] | ButtonsData) => {
            const message = Array.isArray(buttons)
                ? commands.buttons({ buttons })
                : commands.buttons(buttons);
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
        },

        radioboxes: async (params: UiText[] | RadioboxesData) => {
            const message = Array.isArray(params)
                ? commands.radioboxes({ items: params })
                : commands.radioboxes(params);
            const response = await responseHandler.send(message);
            if (response) {
                return (response as RadioboxesCommand).data;
            } else {
                return undefined;
            }
        },

        selectRecord: async (records: any[] | SelectRecordData) => {
            const message = Array.isArray(records)
                ? commands.selectRecord({ records })
                : commands.selectRecord(records);
            const response = await responseHandler.send(message);
            if (response) {
                return (response as SelectRecordCommand).data;
            } else {
                return undefined;
            }
        }

    },
    show: {
        gridFromJsonArray: (data: any[] | GridData) => {
            const message = Array.isArray(data)
                ? commands.grid.fromJsonArray({ data })
                : commands.grid.fromJsonArray(data);
            send(message);
        },

        textBlock: (data: string | TextData) => {
            const message = typeof data === "string"
                ? commands.text({ text: data })
                : commands.text(data);
            send(message);
        },

        progress: (label: UiText | ProgressData) => {
            const message = isUiText(label)
                ? commands.progress({ label })
                : commands.progress(label);
            return new Progress(send(message));
        }
    },
    window: {
        showGrid: (data: any[] | WindowGridData) => {
            const message = Array.isArray(data)
                ? commands.window.showGrid({ data })
                : commands.window.showGrid(data);
            send(message);
        },

        showText: (text: string | WindowTextData) => {
            const message = typeof text === "string"
                ? commands.window.showText({ text })
                : commands.window.showText(text);
            send(message);
        },
    },
};

export default ui;

export { Progress, StyledText, styledText, namedColors };
