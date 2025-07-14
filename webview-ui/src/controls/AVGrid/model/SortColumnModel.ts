import { SetStateAction, useEffect } from "react";
import { TRowCompare, TSortColumn } from "../avGridTypes";
import { defaultCompare } from "../avGridUtils";
import { AVGridDataChangeEvent } from "./AVGridData";
import { AVGridModel } from "./AVGridModel";
import { resolveState } from "../../../common/utils/utils";

export class SortColumnModel {
    model: AVGridModel<any>;

    constructor(model: AVGridModel<any>) {
        this.model = model;
        this.model.data.onChange.subscribe(this.onDataChange);
    }

    onDataChange = (e?: AVGridDataChangeEvent) => {
        if (e?.columns) {
            this.updateRowCompare();
        }
    }

    useModel = () => {
        const sortColumn = this.model.state.use(s => s.sortColumn);

        useEffect(() => {
            this.updateRowCompare();
        } , [sortColumn]);
    }

    updateRowCompare = () => {
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

    setSortColumn = (sortColumn: SetStateAction<TSortColumn | undefined>) => {
        const sColumn = resolveState(sortColumn, () => this.model.state.get().sortColumn);
        this.model.state.update(s => {
            s.sortColumn = sColumn;
        });
    }
}