import ReactDOM from "react-dom";
import styled from "@emotion/styled";
import { SetStateAction, useRef } from "react";

import { DefaultView, ViewPropsRO, Views } from "../../common/classes/view";
import {
    CellFocus,
    Column,
    TDataType,
} from "../../controls/AVGrid/avGridTypes";
import { Popper } from "../../controls/Popper";
import { TPopperModel } from "../../dialogs/types";
import { TComponentState } from "../../common/classes/state";
import { showPopper, visiblePoppers } from "../../dialogs/Poppers";
import { AVGridModel } from "../../controls/AVGrid/model/AVGridModel";
import AVGrid from "../../controls/AVGrid/AVGrid";
import color from "../../theme/color";
import { resolveState } from "../../common/utils/utils";
import { Button } from "../../controls/Button";
import { FlexSpace } from "../../controls/FlexSpace";
import {
    parseBoolean,
    parseNumber,
    parseString,
} from "../../common/utils/parseUtils";

const minWidth = 240;
const minHeight = 160;
const maxWidth = 440;
const maxHeight = 300;

const ColumnsOptionsRoot = styled.div<{ width?: number; height?: number }>(
    (props) => ({
        flex: "1 1 auto",
        minWidth: props.width ?? minWidth,
        minHeight: props.height ?? minHeight,
        border: `1px solid ${color.border.default}`,
        borderRadius: 4,
        backgroundColor: color.background.default,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        "& .buttons-bar": {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            columnGap: 16,
            padding: "4px 16px",
            "& .error-message": {
                color: color.misc.red,
            },
        },
    })
);

const columns: Column[] = [
    {
        key: "visible",
        dataType: "boolean",
        name: "👁",
        width: 40,
        isStatusColumn: true,
    },
    {
        key: "newDataType",
        name: "Type",
        options: ["string", "number", "boolean"],
        width: 80,
        resizible: true,
        isStatusColumn: true,
    },
    {
        key: "newKey",
        name: "Key*",
        resizible: true,
        isStatusColumn: true,
    },
    {
        key: "newName",
        name: "Caption",
        resizible: true,
        isStatusColumn: true,
    },
];

interface EditColumnRow {
    idx: string;
    oldHidden?: boolean;
    visible: boolean;
    oldKey?: string;
    newKey?: string;
    oldName?: string;
    newName?: string;
    oldDataType?: TDataType;
    newDataType?: TDataType;
}

const getRowKey = (row: EditColumnRow) => row.idx;

const defaultColumnsOptionsState = {
    rows: [] as EditColumnRow[],
    deleted: [] as EditColumnRow[],
    focus: undefined as CellFocus | undefined,
    changed: false,
    error: "",
};

type ColumnsOptionsState = typeof defaultColumnsOptionsState;

class ColumnsOptionsModel extends TPopperModel<ColumnsOptionsState, undefined> {
    el = undefined as Element | undefined;
    gridModel = undefined as AVGridModel<any> | undefined;
    onUpdateRows = undefined as
        | ((updateFunc: (rows: any[]) => any[]) => void)
        | undefined;
    width = undefined as number | undefined;
    height = undefined as number | undefined;
    rowIndex = 0;

    prepareEditColumns = () => {
        const columns = this.gridModel?.state.get().columns || [];
        this.state.update((s) => {
            s.rows = columns.map((col) => ({
                idx: (this.rowIndex++).toString(),
                oldHidden: col.hidden,
                visible: !col.hidden,
                oldKey: col.key.toString(),
                newKey: col.key.toString(),
                oldName: col.name,
                newName: col.name,
                oldDataType: col.dataType,
                newDataType: col.dataType,
            }));
        });
    };

    calcInitialSize = () => {
        const width = this.gridModel?.renderModel?.iFrameRef?.offsetWidth;
        const height = this.gridModel?.renderModel?.iFrameRef?.offsetHeight;
        if (width && height) {
            this.width = Math.min(Math.max(width, minWidth), maxWidth);
            this.height = Math.min(Math.max(height, minHeight), maxHeight);
        }
    };

    setFocus = (focus?: SetStateAction<CellFocus | undefined>) => {
        this.state.update((s) => {
            s.focus = focus ? resolveState(focus, () => s.focus) : undefined;
        });
    };

    editRow = (columnKey: string, rowKey: string, value: any) => {
        this.state.update((s) => {
            const row = s.rows.find((r) => getRowKey(r) === rowKey);
            if (row) {
                let prevKey = undefined as string | undefined;
                if (columnKey === "newKey") {
                    prevKey = row.newKey;
                }
                (row as any)[columnKey] = value;
                if (
                    columnKey === "newKey" &&
                    (!row.newName || row.newName === prevKey)
                ) {
                    row.newName = value;
                }
            }
            s.changed = true;
        });
    };

    onAddRows = (count: number, insertIndex?: number) => {
        const newRows = Array.from({ length: count }, () => ({
            idx: (this.rowIndex++).toString(),
            visible: true,
            newDataType: "string" as TDataType,
        }));
        this.state.update((s) => {
            if (insertIndex !== undefined) {
                s.rows.splice(insertIndex, 0, ...newRows);
            } else {
                s.rows.push(...newRows);
            }
            s.changed = true;
        });
        return newRows;
    };

    onDeleteRows = (rowKeys: string[]) => {
        this.state.update((s) => {
            s.deleted = [
                ...s.deleted,
                ...s.rows.filter((r) => rowKeys.includes(getRowKey(r))),
            ];
            s.rows = s.rows.filter((r) => !rowKeys.includes(getRowKey(r)));
            s.changed = true;
        });
    };

    private updateRows = (rows: any[]) => {
        const { rows: columns, deleted } = this.state.get();
        const deletedKeys = deleted
            .map((r) => r.oldKey)
            .filter((key) => !columns.find((c) => c.newKey === key));
        const changedKeys = columns.filter(
            (c) => c.oldKey && c.oldKey !== c.newKey
        );
        const changedTypes = columns.filter(
            (c) => c.oldKey && c.oldDataType !== c.newDataType
        );

        return rows.map((row) => {
            const newRow = { ...row };
            for (const delKey of deletedKeys) {
                delete newRow[delKey!];
            }
            for (const change of changedKeys) {
                newRow[change.newKey!] = newRow[change.oldKey!];
                delete newRow[change.oldKey!];
            }
            for (const change of changedTypes) {
                switch (change.newDataType) {
                    case "number":
                        newRow[change.newKey!] = parseNumber(
                            newRow[change.newKey!]
                        );
                        break;
                    case "boolean":
                        newRow[change.newKey!] = parseBoolean(
                            newRow[change.newKey!]
                        );
                        break;
                    default:
                        newRow[change.newKey!] = parseString(
                            newRow[change.newKey!]
                        );
                        break;
                }
            }
            return newRow;
        });
    };

    private updateColumns = (columns: Column[]): Column[] => {
        const rows = this.state.get().rows;

        return rows
            .filter((r) => r.newKey)
            .map((row) => {
                const existing = columns.find((c) => c.key === row.oldKey);
                return {
                    ...existing,
                    key: row.newKey!,
                    name: row.newName || row.newKey!,
                    dataType: row.newDataType,
                    hidden: !row.visible,
                    ...(existing
                        ? {}
                        : {
                              resizible: true,
                              filterType: "options",
                          }),
                };
            });
    };

    private validate = () => {
        const keys = new Set<string>();
        const rows = this.state.get().rows;
        for (const row of rows) {
            if (row.newKey) {
                if (keys.has(row.newKey)) {
                    this.state.update((s) => {
                        s.error = "Duplicate key";
                    });
                    return false;
                }
                keys.add(row.newKey);
            } else {
                this.state.update((s) => {
                    s.error = "Key is required";
                });
                return false;
            }
        }
        return true;
    };

    applyChanges = () => {
        if (!this.validate()) {
            return;
        }
        this.gridModel?.models.columns.updateColumns(this.updateColumns);
        this.onUpdateRows?.(this.updateRows);
        this.close(undefined);
    };
}

const defaultOffset = [0, 2] as [number, number];
const showColumnsOptionsId = Symbol("ShowColumnsOptions");

export function ColumnsOptions({ model }: ViewPropsRO<ColumnsOptionsModel>) {
    const gridRef = useRef<AVGridModel<any>>(undefined);
    const state = model.state.use();

    return ReactDOM.createPortal(
        <Popper
            key="avgrid-columns-options"
            elementRef={model.el}
            offset={defaultOffset}
            open
            onClose={() => {
                if (visiblePoppers().length === 1 && !state.changed) {
                    model.close(undefined);
                }
            }}
            placement="bottom-end"
            resizable
        >
            <ColumnsOptionsRoot
                className="columns-options-root"
                width={model.width}
                height={model.height}
            >
                <AVGrid
                    ref={gridRef}
                    columns={columns}
                    rows={state.rows}
                    getRowKey={getRowKey}
                    disableSorting
                    focus={state.focus}
                    setFocus={model.setFocus}
                    editRow={model.editRow}
                    onAddRows={model.onAddRows}
                    onDeleteRows={model.onDeleteRows}
                />
                {state.changed && (
                    <div className="buttons-bar">
                        {Boolean(state.error) && (
                            <span className="error-message">{state.error}</span>
                        )}
                        <FlexSpace />
                        <Button onClick={() => model.close(undefined)}>
                            Cancel
                        </Button>
                        <Button onClick={() => model.applyChanges()}>
                            Apply
                        </Button>
                    </div>
                )}
            </ColumnsOptionsRoot>
        </Popper>,
        document.body
    );
}

Views.registerView(showColumnsOptionsId, ColumnsOptions as DefaultView);

export const showColumnsOptions = async (
    el: Element,
    gridModel: AVGridModel<any>,
    onUpdateRows: (updateFunc: (rows: any[]) => any[]) => void
) => {
    const model = new ColumnsOptionsModel(
        new TComponentState(defaultColumnsOptionsState)
    );
    model.el = el;
    model.gridModel = gridModel;
    model.onUpdateRows = onUpdateRows;
    model.prepareEditColumns();
    model.calcInitialSize();
    await showPopper<void>({
        viewId: showColumnsOptionsId,
        model,
    });
};
