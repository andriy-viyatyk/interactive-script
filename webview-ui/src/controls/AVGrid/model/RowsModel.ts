import { useEffect } from "react";
import { TSortDirection } from "../avGridTypes";
import { filterRows } from "../avGridUtils";
import { AVGridModel } from "./AVGridModel";
import { AVGridDataChangeEvent } from "./AVGridData";

export class RowsModel<R> {
    readonly model: AVGridModel<R>;

    constructor(model: AVGridModel<R>) {
        this.model = model;
        this.model.data.onChange.subscribe(this.onDataChange);
    }

    get rowCount() {
        return this.model.data.rows.length + 1; // +1 for header row
    }

    useModel = () => {
        const { rows, searchString, filters } = this.model.props;
        useEffect(() => {
            this.updateRows();
        }, [rows, searchString, filters]);
    }

    private filter = (rows: readonly R[]) => {
        return filterRows(rows, this.model.data.columns, this.model.props.searchString, this.model.props.filters);
    }

    private sort = (rows: readonly R[], direction?: TSortDirection) => {
        const rowCompare = this.model.data.rowCompare;
        if (!rowCompare) return rows;

        let sortedRows = [...rows];
        sortedRows.sort((a, b) => rowCompare(a, b));
        if (direction === "desc") {
            sortedRows = sortedRows.reverse();
        }
        return sortedRows;
    }

    private onDataChange = (e?: AVGridDataChangeEvent) => {
        if (!e) return;
        if (e.columns || e.rowCompare) {
            this.updateRows();
        }
    }

    private updateRows = () => {
        let rows: readonly R[] = this.model.props.rows;
        const direction = this.model.state.get().sortColumn?.direction;
        rows = this.filter(rows);
        rows = this.sort(rows, direction);

        this.model.data.rows = rows;
        this.model.data.change();
        this.model.update({ all: true });
    }
}