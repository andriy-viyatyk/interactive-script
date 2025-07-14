import { useEffect } from "react";
import { AVGridModel } from "./AVGridModel";
import { AVGridDataChangeEvent } from "./AVGridData";

export class EffectsModel<R> {
    model: AVGridModel<R>;

    constructor(model: AVGridModel<R>) {
        this.model = model;
        this.model.data.onChange.subscribe(this.onDataChange);
    }

    useModel = () => {
        const { columns, rows, selected, readonly } = this.model.props;

        useEffect(() => {
            const { scrollToFocus, focus, getRowKey } = this.model.props;
            const { rows } = this.model.data;
            
            if (scrollToFocus && focus && focus.rowKey) {
                const rowIndex = rows.findIndex((row) => getRowKey(row) === focus.rowKey);
                if (rowIndex >= 0) {
                    this.model.renderModel?.scrollToRow(rowIndex + 1, "center");
                }
            }
        }, [])

        useEffect(() => {
            this.model.update({ all: true });
        }, [columns, rows, selected, readonly]);
    }

    onDataChange = (e?: AVGridDataChangeEvent) => {
        if (!e) return;

        if (e.rows) {
            this.model.props.onVisibleRowsChanged?.();
        }
    }
}