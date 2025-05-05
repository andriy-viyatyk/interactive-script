import styled from "@emotion/styled";
import clsx from "clsx";
import { Column, TCellRendererProps } from "./avGridTypes";
import { Button } from "../Button";
import {
    CheckedIcon,
    IndeterminateIcon,
    UncheckedIcon,
} from "../../theme/icons";
import { ReactElement, useCallback } from "react";

const HeaderCellRoot = styled.div({
    "&.header-cell": {
        padding: 0,
        boxSizing: "border-box",
    },
});

const DataCellRoot = styled.div({
    "&.data-cell": {
        padding: 0,
        boxSizing: "border-box",
    },
});

function HeaderCell(props: Readonly<TCellRendererProps>) {
    const { key, style, context } = props;
    const indeterminate = Boolean(
        !context.allSelected && context.selected.size
    );

    const togleSelection = useCallback(() => {
        if (context.readonly) return;

        if (context.allSelected || indeterminate) {
            context.setSelected?.(new Set());
        } else {
            context.setSelected?.(
                new Set([
                    ...context.rows
                        .filter((r) => !r.isRestricted)
                        .map((r) => context.getRowKey(r)),
                ])
            );
        }
    }, [context, indeterminate]);

    let icon: ReactElement;
    if (context.allSelected) {
        icon = <CheckedIcon />;
    } else if (indeterminate) {
        icon = <IndeterminateIcon />;
    } else {
        icon = <UncheckedIcon />;
    }

    return (
        <HeaderCellRoot key={key} style={style} className="header-cell">
            <Button
                size="small"
                type="icon"
                onClick={togleSelection}
                disabled={context.readonly}
            >
                {icon}
            </Button>
        </HeaderCellRoot>
    );
}

function DataCell(props: Readonly<TCellRendererProps>) {
    const { key, row, style, context, className } = props;
    const selected = context.selected.has(context.getRowKey(context.rows[row]));

    const togleSelection = () => {
        const newSet = new Set([...context.selected]);
        if (selected) {
            newSet.delete(context.getRowKey(context.rows[row]));
        } else {
            newSet.add(context.getRowKey(context.rows[row]));
        }
        context.setSelected?.(newSet);
        context.update({ rows: [0, row + 1] });
    };

    return (
        <DataCellRoot
            key={key}
            style={style}
            className={clsx("data-cell", className)}
            onMouseEnter={() => {
                context.setHovered(row);
            }}
            onMouseLeave={() => {
                context.setHovered(-1);
            }}
        >
            <Button
                size="small"
                type="icon"
                onClick={togleSelection}
                disabled={context.readonly}
            >
                {selected ? <CheckedIcon /> : <UncheckedIcon />}
            </Button>
        </DataCellRoot>
    );
}

const SelectColumn: Column = {
    key: "--select-column--",
    name: "SelectColumn",
    width: 32,
    isStatusColumn: true,
    haderRenderer: HeaderCell,
    cellRenderer: DataCell,
};

export default SelectColumn;
