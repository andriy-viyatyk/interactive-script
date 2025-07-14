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
import { UpdateModel } from "./UpdateModel";
import { AVGridEvents } from "./AVGridEvents";
import { FocusModel } from "./FocusModel";
import { EditingModel } from "./EditingModel";
import { CopyPasteModel } from "./CopyPasteModel";
import { ContextMenuModel } from "./ContextMenuModel";
import { EffectsModel } from "./EffectsModel";

export interface AVGridProps<R> {
    className?: string;
    columns: Column<R>[];
    rows: R[];
    configName?: string;
    rowHeight?: number;
    selected?: ReadonlySet<string>;
    setSelected?: (value: SetStateAction<ReadonlySet<string>>) => void;
    loading?: boolean;
    getRowKey: (row: R) => string;
    disableFiltering?: boolean;
    disableSorting?: boolean;
    onClick?: (row: R, col: Column<R>) => void;
    onDoubleClick?: (row: R, col: Column<R>) => void;
    onCellClass?: (row: R, col: Column<R>) => string;
    onColumnsChanged?: () => void;
    focus?: CellFocus<R>;
    setFocus?: (value: SetStateAction<CellFocus<R> | undefined>) => void;
    editRow?: (columnKey: string, rowKey: string, value: any) => void;
    fitToWidth?: boolean;
    onAddRows?: (count: number, insertIndex?: number) => R[];
    onDeleteRows?: (rowKeys: string[]) => void;
    growToHeight?: CSSProperties["height"];
    growToWidth?: CSSProperties["height"];
    searchString?: string;
    readonly?: boolean;
    filters?: TFilter[];
    onVisibleRowsChanged?: () => void;
    scrollToFocus?: boolean;
    onMouseDown?: (e: React.MouseEvent) => void;
    editable?: boolean;
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
    },
}

export class AVGridModels<R> {
    columns: ColumnsModel<R>;
    sortColumn: SortColumnModel;
    rows: RowsModel<R>;
    selected: SelectedModel<R>;
    update: UpdateModel<R>
    focus: FocusModel<R>;
    editing: EditingModel<R>;
    copyPaste: CopyPasteModel<R>;
    contextMenu: ContextMenuModel<R>;
    effects: EffectsModel<R>;

    constructor(model: AVGridModel<R>) {
        this.columns = new ColumnsModel<R>(model);
        this.sortColumn = new SortColumnModel(model);
        this.rows = new RowsModel<R>(model);
        this.selected = new SelectedModel<R>(model);
        this.update = new UpdateModel<R>(model);
        this.focus = new FocusModel<R>(model);
        this.editing = new EditingModel<R>(model);
        this.copyPaste = new CopyPasteModel<R>(model);
        this.contextMenu = new ContextMenuModel<R>(model);
        this.effects = new EffectsModel<R>(model);
    }
}

export class AVGridModel<R> extends TComponentModel<AVGridState<R>, AVGridProps<R>> {
    renderModel: RenderGridModel | null = null;
    data: AVGridData<R>;
    events: AVGridEvents;
    models: AVGridModels<R>;

    constructor(
        modelState: IState<AVGridState<R>> | (new (defaultState: AVGridState<R>) => IState<AVGridState<R>>),
        defaultState?: AVGridState<R>,
    ) {
        super(modelState, defaultState);
        this.data = new AVGridData<R>([], []);
        this.events = new AVGridEvents();
        this.models = new AVGridModels<R>(this);
    }

    useModel = () => {
        this.models.columns.useModel();
        this.models.sortColumn.useModel();
        this.models.rows.useModel();
        this.models.selected.useModel();
        this.models.editing.useModel();
        this.models.effects.useModel();
    }

    update = (rerender?: RerenderInfo) => this.renderModel?.update(rerender);

    setRenderModel = (renderModel: RenderGridModel) => {
        this.renderModel = renderModel;
    }
}