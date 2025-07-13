import { useEffect } from "react";
import { AVGridModel } from "./AVGridModel";
import { AVGridDataChangeEvent } from "./AVGridData";

export class SelectedModel<R> {
    model: AVGridModel<R>;

    constructor(model: AVGridModel<R>) {
        this.model = model;
        this.model.data.onChange.subscribe(this.onDataChange);
    }

    useModel = () => {
        const selected = this.model.props.selected;
        useEffect(() => {
            this.updateSelected();
        }, [selected]);
    }

    onDataChange = (e?: AVGridDataChangeEvent) => {
        if (!e) return;
        if (e.rows) {
            this.updateSelected();
        }
    }

    updateSelected = () => {
        const { selected, getRowKey } = this.model.props;
        const rows = this.model.data.rows;
        this.model.data.allSelected = Boolean(
            selected &&
                selected.size > 0 &&
                selected.size === rows.length &&
                rows.every((r) => selected.has(getRowKey(r)))
        );
        this.model.data.change();
    };
}
