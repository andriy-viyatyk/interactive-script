import { AVGridDataChangeEvent } from "./AVGridData";
import { AVGridModel } from "./AVGridModel";

export class UpdateModel<R> {
    model: AVGridModel<R>;
    lastHovered: number = -1;

    constructor(model: AVGridModel<R>) {
        this.model = model;
        this.model.data.onChange.subscribe(this.onDataChange);
    }

    onDataChange = (e?: AVGridDataChangeEvent) => {
        if (!e) return;
        if (e.hovered) {
            const hovered = this.model.data.hovered;
            if (this.lastHovered >= 0) this.model.update({ rows: [this.lastHovered + 1] });
            if (hovered >= 0) this.model.update({ rows: [hovered + 1] });
            this.lastHovered = hovered;
        }
    }
}