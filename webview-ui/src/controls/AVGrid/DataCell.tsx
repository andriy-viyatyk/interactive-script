import styled from "@emotion/styled";
import clsx from "clsx";

import { TCellRendererProps } from "./avGridTypes";
import { highlightText, useHighlightedText } from "../useHighlightedText";
import { CheckIcon } from "../../theme/icons";
import { falseString, formatDispayValue } from "./avGridUtils";
import { OverflowTooltipText } from "../OverflowTooltipText";
import color from "../../theme/color";
import { DefaultEditFormater } from "./DefaultEditFormater";
import { useCallback } from "react";

const DataCellRoot = styled.div(
    {
        backgroundColor: color.grid.dataCellBackground,
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
        "&.dataCell-alignCenter": {
            justifyContent: "center",
        },
        "&.dataCell-alignRight": {
            justifyContent: "flex-end",
        },
        "&::before": {
            content: "''",
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            backgroundColor: 'transparent',
            pointerEvents: 'none',
        }
    },
    { label: "DataCellRoot" }
);

export function DefaultCellFormater(props: TCellRendererProps) {
    const { col, row: rowIndex, model } = props;
    const column = model.data.columns[col];
    const row = model.data.rows[rowIndex];
    const highlightedText = useHighlightedText();
    let isHighlighted = false;

    let value: any = null;
    try {
        value = row?.[column.key];
        if (!column.displayType || column.displayType === "text") {
            value = formatDispayValue(value, column.displayFormat);

            if (highlightedText && typeof value === "string") {
                value = highlightText(highlightedText, value);
                isHighlighted = true;
            }
        } else if (column.displayType === "checkIcon") {
            return value && !falseString(value) ? (
                <CheckIcon className="cell-check-icon" />
            ) : null;
        }
    } catch {
        value = null;
    }

    if (typeof value === "string" || isHighlighted) {
        value = <OverflowTooltipText>{value}</OverflowTooltipText>;
    }

    return value;
}

export function DataCell(props: Readonly<TCellRendererProps>) {
    const { col, row, style, model, className } = props;
    const column = model.data.columns[col];
    const cellEdit = model.state.use(s => s.cellEdit);
    const isEdit =
        cellEdit?.columnKey === column.key &&
        cellEdit?.rowKey === model.props.getRowKey(model.data.rows[row]);
    const Formater =
        (isEdit ? column.editFormater : column.cellFormater) ??
        (isEdit ? DefaultEditFormater : DefaultCellFormater);

    const rows = model.data.rows;

    const onMouseEnter = useCallback(() => {
        model.models.effects.setHovered(row);
    }, [model, row]);

    const onMouseLeave = useCallback(() => {
        model.models.effects.setHovered(-1);
    }, [model]);

    const onMouseDown = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            model.actions.cellMouseDown(e, rows[row], column, row, col);
        },
        [col, column, model, row, rows]
    );

    const onDragStart = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            if (!isEdit) model.actions.cellDragStart(e, rows[row], column, row, col);
        },
        [col, column, model, rows, isEdit, row]
    );

    const onDragEnter = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            model.models.effects.setHovered(row);
            if (!isEdit) model.actions.cellDragEnter(e, rows[row], column, row, col);
        },
        [model, row, isEdit, rows, column, col]
    );

    const onDragEnd = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            if (!isEdit) model.actions.cellDragEnd(e, rows[row], column, row, col);
        },
        [col, column, model, rows, isEdit, row]
    );

    const onClick = useCallback(() => {
        model.actions.cellClick(rows[row], column, row, col);
    }, [col, column, model, rows, row]);

    const onDoubleClick = useCallback(() => {
        model.actions.cellDoubleClick(rows[row], column);
    }, [column, model, row, rows]);

    return (
        <DataCellRoot
            style={style}
            data-col={col}
            data-row={row}
            className={clsx(
                "data-cell",
                className,
                {
                    "dataCell-alignCenter": column.dataAlignment === "center",
                    "dataCell-alignRight": column.dataAlignment === "right",
                    isEdit,
                },
                model.props.focus ? model.models.focus.focusClass(col, row) : undefined,
                model.props.onCellClass?.(model.data.rows[row], column)
            )}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            draggable={Boolean(model.props.setFocus && !isEdit)}
            onDragStart={onDragStart}
            onDragEnter={onDragEnter}
            onDragEnd={onDragEnd}
            onMouseDown={onMouseDown}
        >
            <Formater {...props} />
        </DataCellRoot>
    );
}
