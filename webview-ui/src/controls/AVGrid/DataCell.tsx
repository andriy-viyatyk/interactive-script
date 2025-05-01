import styled from "@emotion/styled";
import clsx from "clsx";

import { TCellRendererProps } from "./avGridTypes";
import { highlightText, useHighlightedText } from "../useHighlightedText";
import { CheckIcon } from "../../theme/icons";
import { falseString, formatDispayValue } from "./avGridUtils";
import { OverflowTooltipText } from "../OverflowTooltipText";
import color from "../../theme/color";
import { focusClass } from "./useFocus";
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
    const { col, row: rowIndex, context } = props;
    const column = context.columns[col];
    const row = context.rows[rowIndex];
    const highlightedText = useHighlightedText();

    let value: any = null;
    try {
        value = row?.[column.key];
        if (!column.displayType || column.displayType === "text") {
            value = formatDispayValue(value, column.displayFormat);

            if (highlightedText && typeof value === "string") {
                value = highlightText(highlightedText, value);
            }
        } else if (column.displayType === "checkIcon") {
            return value && !falseString(value) ? (
                <CheckIcon className="cell-check-icon" />
            ) : null;
        }
    } catch {
        value = null;
    }

    if (typeof value === "string") {
        value = <OverflowTooltipText>{value}</OverflowTooltipText>;
    }

    return value;
}

export function DataCell(props: Readonly<TCellRendererProps>) {
    const { col, row, style, context, className } = props;
    const column = context.columns[col];
    const cellEdit = context.cellEdit?.use();
    const isEdit =
        cellEdit?.columnKey === column.key &&
        cellEdit?.rowKey === context.getRowKey(context.rows[row]);
    const Formater =
        (isEdit ? column.editFormater : column.cellFormater) ??
        (isEdit ? DefaultEditFormater : DefaultCellFormater);

    const {
        onDragStart: contextDragStart,
        onMouseDown: contextMouseDown,
        onDragEnter: contextDragEnter,
        onDragEnd: contextDragEnd,
        setHovered: contextSetHovered,
        onClick: contextOnClick,
        onDoubleClick: contextOnDoubleClick,
        rows,
    } = context;

    const onMouseEnter = useCallback(() => {
        contextSetHovered(row);
    }, [contextSetHovered, row]);

    const onMouseLeave = useCallback(() => {
        contextSetHovered(-1);
    }, [contextSetHovered]);

    const onMouseDown = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            contextMouseDown?.(e, rows[row], column, row, col);
        },
        [col, column, contextMouseDown, row, rows]
    );

    const onDragStart = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            if (!isEdit) contextDragStart?.(e, rows[row], column, row, col);
        },
        [col, column, contextDragStart, rows, isEdit, row]
    );

    const onDragEnter = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            contextSetHovered(row);
            if (!isEdit) contextDragEnter?.(e, rows[row], column, row, col);
        },
        [contextSetHovered, row, isEdit, contextDragEnter, rows, column, col]
    );

    const onDragEnd = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            if (!isEdit) contextDragEnd?.(e, rows[row], column, row, col);
        },
        [col, column, contextDragEnd, rows, isEdit, row]
    );

    const onClick = useCallback(() => {
        contextOnClick?.(rows[row], column, row, col);
    }, [contextOnClick, col, column, rows, row]);

    const onDoubleClick = useCallback(() => {
        contextOnDoubleClick?.(rows[row], column);
    }, [column, contextOnDoubleClick, row, rows]);

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
                context.focus ? focusClass(col, row, context) : undefined,
                context.onCellClass?.(context.rows[row], column)
            )}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            draggable={Boolean(context.setFocus && !isEdit)}
            onDragStart={onDragStart}
            onDragEnter={onDragEnter}
            onDragEnd={onDragEnd}
            onMouseDown={onMouseDown}
        >
            <Formater {...props} />
        </DataCellRoot>
    );
}
