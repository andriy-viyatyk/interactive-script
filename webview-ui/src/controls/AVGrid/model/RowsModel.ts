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
        this.model.events.onRowsAdded.subscribe(this.onRowsAdded);
        this.model.events.onRowsDeleted.subscribe(this.onRowsDeleted);
    }

    get rowCount() {
        return this.model.data.rows.length + 1; // +1 for header row
    }

    useModel = () => {
        const { rows, searchString, filters } = this.model.props;
        const sortColumn = this.model.state.use(s => s.sortColumn);

        useEffect(() => {
            this.unfreezeRows();
        }, [searchString, filters, sortColumn]);

        useEffect(() => {
            this.updateRows();
        }, [rows, searchString, filters, sortColumn]);
    }

    freezeRows = () => {
        const { searchString, filters } = this.model.props;
        const sortColumn = this.model.state.get().sortColumn;

        if (!sortColumn && !searchString?.length && !filters?.length) {
            // freeze only reordered rows
            return;
        }

        this.model.data.rowsFrozen = true;
        this.model.data.change();
        this.model.update({ rows: [0] });
    }

    unfreezeRows = () => {
        if (!this.model.data.rowsFrozen) return;

        this.model.data.rowsFrozen = false;
        this.model.data.change();
        this.model.update({ rows: [0] });
        this.updateRows();
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

        if (e.rowCompare) {
            this.unfreezeRows();
        }

        if (e.columns) {
            this.updateRows();
        }
    }

    private updateRows = () => {
        if (this.model.data.rowsFrozen) {
            this.updateFrozenRows();
            return;
        }

        let rows: readonly R[] = this.model.props.rows;
        const direction = this.model.state.get().sortColumn?.direction;
        rows = this.filter(rows);
        rows = this.sort(rows, direction);

        this.model.data.rows = rows;
        this.model.data.change();
        this.model.update({ all: true });
    }

    private updateFrozenRows = () => {
        if (!this.model.data.rowsFrozen) return;

        const visibleRowsKeys = this.model.data.rows.reduce((acc, row, idx) => {
            const key = this.model.props.getRowKey(row);
            acc[key] = idx;
            return acc;
        }, {} as Record<string, number>);

        const newRows = [...this.model.data.rows];
        this.model.props.rows.forEach((row) => {
            const key = this.model.props.getRowKey(row);
            const idx = visibleRowsKeys[key];
            if (idx !== undefined) {
                newRows[idx] = row;
            }
        });
        this.model.data.rows = newRows;
        this.model.data.change();
        this.model.update({ all: true });
    }

    private onRowsAdded = (data?: {rows: R[], insertIndex?: number}) => {
        if (!data || !this.model.data.rowsFrozen) return;

        const newRows = [...this.model.data.rows, ...data.rows];
        this.model.data.rows = newRows;
    }

    private onRowsDeleted = (data?: {rowKeys: string[]}) => {
        if (!data || !this.model.data.rowsFrozen) return;

        const newRows = this.model.data.rows.filter(row => !data.rowKeys.includes(this.model.props.getRowKey(row)));
        this.model.data.rows = newRows;
    }
}