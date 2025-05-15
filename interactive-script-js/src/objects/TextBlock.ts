import { TextCommand } from "../../../shared/commands/output-text";
import { UiText } from "../../../shared/ViewMessage";
import { send } from "../handlers";

export class TextBlock {
    private readonly textBlock: TextCommand;

    constructor(textBlock: TextCommand) {
        this.textBlock = textBlock;
    }

    private readonly sendUpdate = () => {
        send(this.textBlock);
    };

    get text(): string {
        return this.textBlock.data?.text || "";
    }

    set text(value: string) {
        this.textBlock.data = { ...this.textBlock.data, text: value };
        this.sendUpdate();
    }

    get title(): UiText | undefined {
        return this.textBlock.data?.title;
    }

    set title(value: UiText | undefined) {
        this.textBlock.data = { text: "", ...this.textBlock.data, title: value };
        this.sendUpdate();
    }
}
