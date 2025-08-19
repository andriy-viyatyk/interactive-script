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
    const { key, style, model } = props;
    const indeterminate = Boolean(
        !model.data.allSelected && model.props.selected?.size
    );

    const togleSelection = useCallback(() => {
        if (model.props.readonly) return;

        if (model.data.allSelected || indeterminate) {
            model.props.setSelected?.(new Set());
        } else {
            model.props.setSelected?.(
                new Set([
                    ...model.data.rows
                        .filter((r) => !r.isRestricted)
                        .map((r) => model.props.getRowKey(r)),
                ])
            );
        }
    }, [model, indeterminate]);

    let icon: ReactElement;
    if (model.data.allSelected) {
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
                disabled={model.props.readonly}
            >
                {icon}
            </Button>
        </HeaderCellRoot>
    );
}

function DataCell(props: Readonly<TCellRendererProps>) {
    const { key, row, col, style, model, className } = props;
    const selected = model.props.selected?.has(model.props.getRowKey(model.data.rows[row]));

    const togleSelection = () => {
        const newSet = new Set(model.props.selected ? [...model.props.selected] : []);
        if (selected) {
            newSet.delete(model.props.getRowKey(model.data.rows[row]));
        } else {
            newSet.add(model.props.getRowKey(model.data.rows[row]));
        }
        model.props.setSelected?.(newSet);
        model.update({ rows: [0, row + 1] });
    };

    return (
        <DataCellRoot
            key={key}
            style={style}
            className={clsx("data-cell", className)}
            onMouseEnter={() => {
                model.models.effects.setHovered({row, col});
            }}
            onMouseLeave={() => {
                model.models.effects.setHovered({row: -1, col: -1});
            }}
        >
            <Button
                size="small"
                type="icon"
                onClick={togleSelection}
                disabled={model.props.readonly}
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
