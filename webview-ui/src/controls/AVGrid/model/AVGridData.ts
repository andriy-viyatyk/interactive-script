import { Subscription } from "../../../common/classes/events";
import { Column, TRowCompare } from "../avGridTypes";

const defaultChangeEvent = {
    rows: false,
    columns: false,
    lastIsStatusIndex: false,
    rowCompare: false,
    allSelected: false,
    hovered: false,
    editTime: false,
}

export type AVGridDataChangeEvent = typeof defaultChangeEvent;

export class AVGridData<R> {
    readonly onChange = new Subscription<AVGridDataChangeEvent>();
    private _changeEvent: AVGridDataChangeEvent = {...defaultChangeEvent};

    // Fields
    private _rows: readonly R[];
    private _columns: Column<R>[];
    private _lastIsStatusIndex = -1;
    private _rowCompare: TRowCompare | undefined;
    private _allSelected = false;
    private _hovered = -1;
    private _editTime: number = new Date().getTime();

    constructor(rows: R[], columns: Column<R>[]) {
        this._rows = rows;
        this._columns = columns;
    }

    change = (event?: Partial<AVGridDataChangeEvent>) => {
        const changeEvent = {...event, ...this._changeEvent};
        if (event || Object.getOwnPropertyNames(changeEvent).some((key: any) => (changeEvent as any)[key])) {
            this._changeEvent = {...defaultChangeEvent};
            this.onChange.send(changeEvent);
        }
    }

    get rows(): readonly R[] {
        return this._rows;
    }

    set rows(value: readonly R[]) {
        if (this._rows === value) return;
        this._rows = value;
        this._changeEvent.rows = true;
    }

    get columns(): Column<R>[] {
        return this._columns;
    }

    set columns(value: Column<R>[]) {
        if (this._columns === value) return;
        this._columns = value;
        this._changeEvent.columns = true;
    }

    get lastIsStatusIndex(): number {
        return this._lastIsStatusIndex;
    }

    set lastIsStatusIndex(value: number) {
        if (this._lastIsStatusIndex === value) return;
        this._lastIsStatusIndex = value;
        this._changeEvent.lastIsStatusIndex = true;
    }

    get rowCompare(): TRowCompare | undefined {
        return this._rowCompare;
    }

    set rowCompare(value: TRowCompare | undefined) {
        if (this._rowCompare === value) return;
        this._rowCompare = value;
        this._changeEvent.rowCompare = true;
    }

    get allSelected(): boolean {
        return this._allSelected;
    }

    set allSelected(value: boolean) {
        if (this._allSelected === value) return;
        this._allSelected = value;
        this._changeEvent.allSelected = true;
    }

    get hovered(): number {
        return this._hovered;
    }

    set hovered(value: number) {
        if (this._hovered === value) return;
        this._hovered = value;
        this._changeEvent.hovered = true;
    }

    get editTime(): number {
        return this._editTime;
    }

    set editTime(value: number) {
        if (this._editTime === value) return;
        this._editTime = value;
        this._changeEvent.editTime = true;
    }
}