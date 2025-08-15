import { CSSProperties, SetStateAction } from "react";
import { CellEdit, CellFocus, Column, TFilter, TSortColumn } from "../avGridTypes";
import { TComponentModel } from "../../../common/classes/model";
import RenderGridModel from "../../RenderGrid/RenderGridModel";
import { RerenderInfo } from "../../RenderGrid/types";
import { IState } from "../../../common/classes/state";
import { ColumnsModel } from "./ColumnsModel";
import { AVGridData } from "./AVGridData";
import { SortColumnModel } from "./SortColumnModel";
import { RowsModel } from "./RowsModel";
import { SelectedModel } from "./SelectedModel";
import { AVGridEvents } from "./AVGridEvents";
import { FocusModel } from "./FocusModel";
import { EditingModel } from "./EditingModel";
import { CopyPasteModel } from "./CopyPasteModel";
import { ContextMenuModel } from "./ContextMenuModel";
import { EffectsModel } from "./EffectsModel";
import { AVGridActions } from "./AVGridActions";

export interface AVGridProps<R> {
    className?: string;
    columns: Column<R>[];
    rows: R[];
    getRowKey: (row: R) => string;
    rowHeight?: number;
    searchString?: string;
    filters?: TFilter[];
    readonly?: boolean;
    disableFiltering?: boolean;
    disableSorting?: boolean;
    loading?: boolean;

    selected?: ReadonlySet<string>;
    setSelected?: (value: SetStateAction<ReadonlySet<string>>) => void;
    focus?: CellFocus<R>;
    setFocus?: (value: SetStateAction<CellFocus<R> | undefined>) => void;

    editRow?: (columnKey: string, rowKey: string, value: any) => void;
    onAddRows?: (count: number, insertIndex?: number) => R[];
    onDeleteRows?: (rowKeys: string[]) => void;
    
    onClick?: (row: R, col: Column<R>) => void;
    onDoubleClick?: (row: R, col: Column<R>) => void;
    onMouseDown?: (e: React.MouseEvent) => void;
    onCellClass?: (row: R, col: Column<R>) => string;
    onColumnsChanged?: () => void;
    onVisibleRowsChanged?: () => void;
    onDataChanged?: () => void;
    
    scrollToFocus?: boolean;
    fitToWidth?: boolean;
    growToHeight?: CSSProperties["height"];
    growToWidth?: CSSProperties["height"]; 
}

export interface AVGridState<R> {
    columns: Column<R>[]; // props colummns updated by resize and reorder
    sortColumn?: TSortColumn;
    cellEdit: CellEdit<R>;
}

export const defaultAVGridState: AVGridState<any> = {
    columns: [],
    sortColumn: undefined,
    cellEdit: {
        columnKey: "",
        rowKey: "",
        value: undefined,
        dontSelect: false,
        changed: false,
    },
}

export class AVGridModels<R> {
    readonly columns: ColumnsModel<R>;
    readonly sortColumn: SortColumnModel<R>;
    readonly rows: RowsModel<R>;
    readonly selected: SelectedModel<R>;
    readonly focus: FocusModel<R>;
    readonly editing: EditingModel<R>;
    readonly copyPaste: CopyPasteModel<R>;
    readonly contextMenu: ContextMenuModel<R>;
    readonly effects: EffectsModel<R>;

    constructor(model: AVGridModel<R>) {
        this.columns = new ColumnsModel<R>(model);
        this.sortColumn = new SortColumnModel(model);
        this.rows = new RowsModel<R>(model);
        this.selected = new SelectedModel<R>(model);
        this.focus = new FocusModel<R>(model);
        this.editing = new EditingModel<R>(model);
        this.copyPaste = new CopyPasteModel<R>(model);
        this.contextMenu = new ContextMenuModel<R>(model);
        this.effects = new EffectsModel<R>(model);
    }
}

export class AVGridModel<R> extends TComponentModel<AVGridState<R>, AVGridProps<R>> {
    renderModel: RenderGridModel | null = null;
    readonly data: AVGridData<R>;
    readonly events: AVGridEvents<R>;
    readonly actions: AVGridActions<R>;
    readonly models: AVGridModels<R>;
    readonly flags = {
        noScrollOnFocus: false,
    }

    constructor(
        modelState: IState<AVGridState<R>> | (new (defaultState: AVGridState<R>) => IState<AVGridState<R>>),
        defaultState?: AVGridState<R>,
    ) {
        super(modelState, defaultState);
        this.data = new AVGridData<R>([], []);
        this.events = new AVGridEvents(this);
        this.models = new AVGridModels<R>(this);
        this.actions = new AVGridActions<R>(this);
    }

    useModel = () => {
        this.models.columns.useModel();
        this.models.sortColumn.useModel();
        this.models.rows.useModel();
        this.models.selected.useModel();
        this.models.editing.useModel();
        this.models.effects.useModel();
    }

    update = (rerender?: RerenderInfo) => {
        this.renderModel?.update(rerender);
    }

    setRenderModel = (renderModel: RenderGridModel) => {
        this.renderModel = renderModel;
    }

    focusGrid = () => {
        this.renderModel?.gridRef.current?.focus();
    }

    dataChanged = () => {
        setTimeout(() => { this.props.onDataChanged?.(); }, 0);
    }
}