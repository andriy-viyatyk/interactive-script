import { useEffect } from "react";
import { AVGridModel } from "./AVGridModel";

export class EffectsModel<R> {
    model: AVGridModel<R>;

    constructor(model: AVGridModel<R>) {
        this.model = model;
    }

    useModel = () => {
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
    }
}