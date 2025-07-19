import { useEffect } from "react";
import { AVGridModel } from "./AVGridModel";
import { AVGridDataChangeEvent } from "./AVGridData";
import { Column } from "../avGridTypes";

export class EffectsModel<R> {
    readonly model: AVGridModel<R>;
    private lastHovered: number = -1;

    constructor(model: AVGridModel<R>) {
        this.model = model;
        this.model.data.onChange.subscribe(this.onDataChange);
        this.model.events.content.onMouseLeave.subscribe(this.onContentMouseLeave);
        this.model.events.cell.onClick.subscribe(this.propsOnClick);
        this.model.events.cell.onDoubleClick.subscribe(this.propsOnDoubleClick);
    }

    setHovered = (hovered: number) => {
        this.model.data.hovered = hovered;
        setTimeout(() => { this.model.data.change(); }, hovered >= 0 ? 10 : 50);
    }

    useModel = () => {
        const { columns, rows, selected, readonly, focus } = this.model.props;

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

        useEffect(() => {
            const newRowKey = this.model.data.newRowKey;
            if (newRowKey) {
                const selection = this.model.models.focus.getGridSelection();
                if (!selection?.rows.find(row => this.model.props.getRowKey(row) === newRowKey)) {
                    this.model.data.newRowKey = undefined;
                    this.model.data.change();
                    this.model.actions.deleteRows([newRowKey]);
                }
            }
        }, [focus]);
    }

    private onDataChange = (e?: AVGridDataChangeEvent) => {
        if (!e) return;

        if (e.rows) {
            this.model.props.onVisibleRowsChanged?.();
        }

        if (e.columns) {
            this.model.props.onColumnsChanged?.();
        }

        if (e.hovered) {
            const hovered = this.model.data.hovered;
            if (this.lastHovered >= 0) this.model.update({ rows: [this.lastHovered + 1] });
            if (hovered >= 0) this.model.update({ rows: [hovered + 1] });
            this.lastHovered = hovered;
        }
    }

    private onContentMouseLeave = () => {
        this.model.data.hovered = -1;
        this.model.data.change();
    }

    private propsOnClick = (data?: {row: any, col: Column, rowIndex: number, colIndex: number}) => {
        if (!data) return;
        this.model.props.onClick?.(data.row, data.col);
    }

    private propsOnDoubleClick = (data?: {row: any, col: Column}) => {
        if (!data) return;
        this.model.props.onDoubleClick?.(data.row, data.col);
    }
}