import { csvToRecords } from "../../../common/utils/csvUtils";
import { toClipboard } from "../../../common/utils/utils";
import { Column } from "../avGridTypes";
import { columnDisplayValue, rowsToCsvText } from "../avGridUtils";
import { getGridSelection } from "../useUtils";
import { AVGridModel } from "./AVGridModel";

export class CopyPasteModel<R> {
    readonly model: AVGridModel<R>;

    constructor(model: AVGridModel<R>) {
        this.model = model;
        this.model.events.content.onKeyDown.subscribe(this.onContentAreaKeyDown);
    }

    copySelection = () => {
        const { focus, getRowKey } = this.model.props;
        if (!focus) return;
        const { rows, columns } = this.model.data;

        const selection = getGridSelection(focus, rows, columns, getRowKey);
        if (!selection) return;

        let text = '';
        if (selection.rows.length === 1 && selection.columns.length === 1) {
            text = columnDisplayValue(selection.columns[0], selection.rows[0]);
        } else {
            text =
                rowsToCsvText(selection.rows, selection.columns, false, true) ??
                '';
        }
        toClipboard(text);
    }

    canPasteFromClipboard = async () => {
        const { focus, getRowKey } = this.model.props;
        if (!focus) return false;
        const { rows, columns } = this.model.data;

        const selection = getGridSelection(focus, rows, columns, getRowKey);
        if (selection && selection.rows.length && selection.columns.length) {
            const text = await navigator.clipboard.readText();
            if (text) {
                return true;
            }
        }
        return false;
    }

    pasteFromClipboard = async () => {
        const { focus, getRowKey } = this.model.props;
        if (!focus) return;
        const { rows, columns } = this.model.data;

        const selection = getGridSelection(focus, rows, columns, getRowKey);
        if (selection && selection.rows.length && selection.columns.length) {
            const text = await navigator.clipboard.readText();
            if (text) {
                let records = csvToRecords(text);
                if (!records.length && text?.length) {
                    records = [[text]];
                }
                if (records.length && records[0].length) {
                    let pasteColumns = selection.columns;
                    let pasteRows = selection.rows;
    
                    if (pasteColumns.length === 1 && pasteRows.length === 1) {
                        ({ pasteColumns, pasteRows } = this.expandPasteRange(records.length, records[0].length));
                    }

                    const sourceRowCount = records.length;
                    const sourceColCount = records[0].length;
                    let sourceRow = 0;
                    let sourceCol = 0;
                    for (const row of pasteRows) {
                        sourceCol = 0;
                        for (const col of pasteColumns) {
                            if (sourceRow < sourceRowCount && sourceCol < sourceColCount) {
                                this.model.models.editing.editCell(col, row, records[sourceRow][sourceCol]);
                                sourceCol++;
                                if (sourceCol === sourceColCount) {
                                    sourceCol = 0;
                                }
                            }
                        }
                        sourceRow++;
                        if (sourceRow === sourceRowCount) {
                            sourceRow = 0;
                        }
                    }
                }
            }
        }
    }

    private expandPasteRange = (rowCount: number, colCount: number) => {
        let pasteColumns: Column<R>[] = [];
        let pasteRows: R[] = [];

        const { focus, setFocus, getRowKey, onAddRows } = this.model.props;
        if (!focus) return { pasteColumns, pasteRows };
        const { rows, columns } = this.model.data;

        const startRowIndex = rows.findIndex(r => getRowKey(r) === focus.rowKey);
        const startColIndex = columns.findIndex(c => c.key === focus.columnKey);
        if (startRowIndex < 0 || startColIndex < 0) return { pasteColumns, pasteRows };

        let endRowIndex = startRowIndex + rowCount - 1;
        let newRows: R[] = [];
        if (endRowIndex >= rows.length) {
            newRows = onAddRows?.(endRowIndex - rows.length + 1) ?? [];
            endRowIndex = rows.length - 1 + newRows.length;
        }

        const endColIndex = Math.min(startColIndex + colCount - 1, columns.length - 1);

        pasteColumns = columns.slice(startColIndex, endColIndex + 1);
        pasteRows = rows.slice(startRowIndex, endRowIndex + 1).concat(newRows);

        if (pasteColumns.length && pasteRows.length && setFocus) {
            setFocus({
                columnKey: pasteColumns[0].key,
                rowKey: getRowKey(pasteRows[0]),
                isDragging: false,
                selection: {
                    colKeyStart: pasteColumns[pasteColumns.length - 1].key,
                    rowKeyStart: getRowKey(pasteRows[pasteRows.length - 1]),
                    colKeyEnd: pasteColumns[0].key,
                    rowKeyEnd: getRowKey(pasteRows[0]),
                    colStart: endColIndex,
                    rowStart: startRowIndex + pasteRows.length - 1,
                    colEnd: startColIndex,
                    rowEnd: startRowIndex,
                }
            });
        }

        return { pasteColumns, pasteRows };
    }

    private onContentAreaKeyDown = (e?: React.KeyboardEvent<HTMLDivElement>) => {
        if (!e) return;
        const { focus } = this.model.props;
        if (e.ctrlKey && focus) {
            switch (e.code) {
                case 'KeyC': {
                    this.copySelection();
                    break;
                }
                case 'KeyV': {
                    e.preventDefault();
                    e.stopPropagation();
                    this.pasteFromClipboard();
                    break;
                }
                default:
                    break;
            }
        }
    }
}