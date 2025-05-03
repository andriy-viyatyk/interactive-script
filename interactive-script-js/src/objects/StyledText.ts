import { LogCommand } from "../../../shared/commands/log";
import { Styles, TextWithStyle, UiText, UiTextBlock } from "../../../shared/ViewMessage";
import { send } from "../handlers";
import { StyledTextColor } from "./StyledTextColor";

export class StyledText {
    value: UiText;

    constructor(uiText?: UiText) {
        this.value = uiText ?? "";
    }

    private readonly prepareLastLine = () => {
        if (this.value === undefined) {
            this.value = [];
        }
        if (typeof this.value === "string") {
            this.value = [this.value];
        }
        if (this.value.length === 0) {
            this.value.push({ text: "", styles: {} });
        }

        const lastLine = this.value[this.value.length - 1];
        if (typeof lastLine === "string") {
            this.value[this.value.length - 1] = {
                text: lastLine,
                styles: {},
            };
        }
    }

    private get data() {
        this.prepareLastLine();
        return this.value as UiTextBlock[];
    }

    private get lastLine() {
        const data = this.data;
        return data[data.length - 1] as TextWithStyle;
    }

    then = (text?: string) => {
        this.data.push({text: text ?? "", styles: {}});
        return this;
    }

    color = (color: StyledTextColor) => {
        this.lastLine.styles!.color = color;
        return this;
    }

    background = (color: StyledTextColor) => {
        const lastLine = this.lastLine;
        lastLine.styles!.backgroundColor = color;
        lastLine.styles!.padding = "0 2px";
        lastLine.styles!.borderRadius = 2;
        return this;
    }

    border = (color: StyledTextColor) => {
        const lastLine = this.lastLine;
        lastLine.styles!.border = `1px solid ${color}`;
        lastLine.styles!.borderRadius = 2;
        lastLine.styles!.padding = "0 2px";
        return this;
    }

    fontSize = (size: string | number) => {
        const lastLine = this.lastLine;
        lastLine.styles!.fontSize = size;
        return this;
    }

    underline = () => {
        const lastLine = this.lastLine;
        lastLine.styles!.textDecoration = "underline";
        return this;
    }

    italic = () => {
        const lastLine = this.lastLine;
        lastLine.styles!.fontStyle = "italic";
        return this;
    }

    bold = () => {
        const lastLine = this.lastLine;
        lastLine.styles!.fontWeight = "bold";
        return this;
    }

    style = (styles: Styles) => {
        const lastLine = this.lastLine;
        lastLine.styles = { ...lastLine.styles, ...styles };
        return this;
    }
}

export class StyledLogCommand extends StyledText {
    private readonly command: LogCommand;

    constructor(command: LogCommand) {
        super(command.data);
        this.command = command;
    }

    print = () => {
        this.command.data = this.value;
        send(this.command);
    }
}

export function styledText(value: string): StyledText {
    return new StyledText(value);
}