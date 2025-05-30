import commands from "../shared/commands";
import { isUiText, UiText } from "../shared/ViewMessage";
import { ConfirmCommand, ConfirmData } from "../shared/commands/input-confirm";
import { GridData } from "../shared/commands/output-grid";
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
import { DateInputCommand, DateInputData } from "../shared/commands/input-date";
import { PackedGridArray } from "../shared/PackedGridArray";
import { TextBlock } from "./src/objects/TextBlock";
import { SelectCommand, SelectData } from "../shared/commands/inline-select";
import { InlineConfirmCommand, InlineConfirmData } from "../shared/commands/inline-confirm";
import { InlineTextCommand } from "../shared/commands/inline-text";
import { InlineDateInputCommand } from "../shared/commands/inline-date";

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
    output: {
         append: (message: string) => send(commands.output.append(message)),
         clear: () => send(commands.output.clear()),
    },
    dialog: {
        buttons: async (buttons: UiText[] | ButtonsData) => {
            const message = Array.isArray(buttons)
                ? commands.inputButtons({ buttons })
                : commands.inputButtons(buttons);
            const response = await responseHandler.send(message);
            if (response) {
                return (response as ButtonsCommand).data?.result;
            } else {
                return undefined;
            }
        },

        confirm: async (params: UiText | ConfirmData) => {
            const message = isUiText(params)
                ? commands.inputConfirm({ message: params })
                : commands.inputConfirm(params);
            const response = await responseHandler.send(message);
            if (response) {
                return (response as ConfirmCommand).data?.result;
            } else {
                return undefined;
            }
        },

        textInput: async (params: UiText | TextInputData) => {
            const message = isUiText(params)
                ? commands.inputText({ title: params })
                : commands.inputText(params);
            const response = await responseHandler.send(message);
            if (response) {
                return (response as TextInputCommand).data;
            } else {
                return undefined;
            }
        },

        dateInput: async (params?: UiText | DateInputData) => {
            const message = isUiText(params)
                ? commands.inputDate({ title: params })
                : commands.inputDate(params ?? {});
            const response = await responseHandler.send(message);
            if (response) {
                if (response.data && response.data.result) {
                    response.data.result = new Date(response.data.result);
                }
                return (response as DateInputCommand).data;
            } else {
                return undefined;
            }
        },

        checkboxes: async (params: UiText[] | CheckboxesData) => {
            const message = Array.isArray(params)
                ? commands.inputCheckboxes({ items: params.map((item) => ({ label: item })) })
                : commands.inputCheckboxes(params);
            const response = await responseHandler.send(message);
            if (response) {
                return (response as CheckboxesCommand).data;
            } else {
                return undefined;
            }
        },

        radioboxes: async (params: UiText[] | RadioboxesData) => {
            const message = Array.isArray(params)
                ? commands.inputRadioboxes({ items: params })
                : commands.inputRadioboxes(params);
            const response = await responseHandler.send(message);
            if (response) {
                return (response as RadioboxesCommand).data;
            } else {
                return undefined;
            }
        },

        selectRecord: async (records: any[] | SelectRecordData) => {
            const message = Array.isArray(records)
                ? commands.inputSelectRecord({ records })
                : commands.inputSelectRecord(records);
            const response = await responseHandler.send(message);
            if (response) {
                return (response as SelectRecordCommand).data;
            } else {
                return undefined;
            }
        }

    },
    inline: {
        select: async <T = any>(options: SelectData<T>) => {
            const message = commands.inputSelect(options);
            const response = await responseHandler.send(message);
            if (response) {
                return (response as SelectCommand<T>).data;
            } else {
                return undefined;
            }
        },

        confirm: async (params: UiText | InlineConfirmData) => {
            const message = isUiText(params)
                ? commands.inlineConfirm({ message: params })
                : commands.inlineConfirm(params);
            const response = await responseHandler.send(message);
            if (response) {
                return (response as InlineConfirmCommand).data?.result;
            } else {
                return undefined;
            }
        },

        textInput: async (params: UiText | TextInputData) => {
            const message = isUiText(params)
                ? commands.inlineText({ title: params })
                : commands.inlineText(params);
            const response = await responseHandler.send(message);
            if (response) {
                return (response as InlineTextCommand).data;
            } else {
                return undefined;
            }
        },

        dateInput: async (params?: UiText | DateInputData) => {
            const message = isUiText(params)
                ? commands.inlineDate({ title: params })
                : commands.inlineDate(params ?? {});
            const response = await responseHandler.send(message);
            if (response) {
                if (response.data && response.data.result) {
                    response.data.result = new Date(response.data.result);
                }
                return (response as InlineDateInputCommand).data;
            } else {
                return undefined;
            }
        },
    },
    show: {
        gridFromJsonArray: (data: any[] | GridData) => {
            const message = Array.isArray(data)
                ? commands.outputGrid.fromJsonArray({ data })
                : commands.outputGrid.fromJsonArray(data);
            send(message);
        },

        textBlock: (data: string | TextData) => {
            const message = typeof data === "string"
                ? commands.outputText({ text: data })
                : commands.outputText(data);
            return new TextBlock(send(message));
        },

        progress: (label: UiText | ProgressData) => {
            const message = isUiText(label)
                ? commands.outputProgress({ label })
                : commands.outputProgress(label);
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
    on: {
        consoleLog: (callback: (message: string) => void) => {
            const message = commands.onConsole.log();
            const subscription = responseHandler.subscribe(message, (response) => {
                if (response.data) {
                    callback(response.data);
                }
            });
            return subscription;
        },
        consoleError: (callback: (message: string) => void) => {
            const message = commands.onConsole.error();
            const subscription = responseHandler.subscribe(message, (response) => {
                if (response.data) {
                    callback(response.data);
                }
            });
            return subscription;
        },
    }
};

export default ui;

export { Progress, StyledText, styledText, namedColors, PackedGridArray };
