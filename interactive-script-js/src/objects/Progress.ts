import { ProgressCommand } from "../../../shared/commands/output-progress";
import { UiText } from "../../../shared/ViewMessage";
import { send } from "../handlers";

export class Progress {
    private readonly progress: ProgressCommand;

    constructor(progress: ProgressCommand) {
        this.progress = progress;
    }

    private readonly sendUpdate = () => {
        send(this.progress);
    }

    get label(): UiText {
        return this.progress.data?.label || "";
    }

    set label(value: UiText) {
        this.progress.data = { ...this.progress.data, label: value };
        this.sendUpdate();
    }

    get max(): number | undefined {
        return this.progress.data?.max;
    }

    set max(value: number | undefined) {
        this.progress.data = { ...this.progress.data, max: value };
        this.sendUpdate();
    }

    get value(): number | undefined {
        return this.progress.data?.value;
    }

    set value(value: number | undefined) {
        this.progress.data = { ...this.progress.data, value: value };
        this.sendUpdate();
    }

    get completed(): boolean | undefined {
        return this.progress.data?.completed;
    }

    set completed(value: boolean | undefined) {
        this.progress.data = { ...this.progress.data, completed: value };
        this.sendUpdate();
    }
}