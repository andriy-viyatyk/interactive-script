import { useEffect } from "react";
import { TRowCompare } from "../avGridTypes";
import { defaultCompare } from "../avGridUtils";
import { AVGridDataChangeEvent } from "./AVGridData";
import { AVGridModel } from "./AVGridModel";

export class SortColumnModel<R> {
    readonly model: AVGridModel<R>;

    constructor(model: AVGridModel<R>) {
        this.model = model;
        this.model.data.onChange.subscribe(this.onDataChange);
    }

    sortColumn = (columnKey: string | keyof R) => {
        this.model.state.update(s => {
            if (s.sortColumn?.key === (columnKey as string)) {
                if (s.sortColumn.direction === "desc") {
                    s.sortColumn = undefined;
                } else {
                    s.sortColumn = { key: columnKey as string, direction: "desc" };
                }
            } else {
                s.sortColumn = { key: columnKey as string, direction: "asc" };
            }
        });
    }

    useModel = () => {
        const sortColumn = this.model.state.use(s => s.sortColumn);

        useEffect(() => {
            this.updateRowCompare();
        } , [sortColumn]);
    }

    private onDataChange = (e?: AVGridDataChangeEvent) => {
        if (e?.columns) {
            this.updateRowCompare();
        }
    }

    private updateRowCompare = () => {
        let rowCompare: TRowCompare | undefined;
        const sortColumn = this.model.state.get().sortColumn;
        const columns = this.model.data.columns;
        if (sortColumn) {
            const col = columns.find(c => c.key === sortColumn.key);
            rowCompare = col?.rowCompare ?? defaultCompare(sortColumn.key);
        }
        this.model.data.rowCompare = rowCompare;
        this.model.data.change();
    }
}