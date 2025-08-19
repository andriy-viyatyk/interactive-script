import {
    forwardRef,
    HTMLAttributes,
    ReactNode,
    useCallback,
    useImperativeHandle,
    useMemo,
} from "react";
import styled from "@emotion/styled";
import clsx from "clsx";

import {
    TCellRenderer,
    TCellRendererProps,
} from "./avGridTypes";
import { RefType, RenderCellFunc } from "../RenderGrid/types";
import { AVGridProvider } from "./useAVGridContext";
import RenderGrid from "../RenderGrid/RenderGrid";
import color from "../../theme/color";
import { CircularProgress } from "../CircularProgress";
import { HeaderCell } from "./HeaderCell";
import { DataCell } from "./DataCell";
import { HighlightedTextProvider } from "../useHighlightedText";
import { FilterPoper } from "./filters/FilterPoper";
import { AVGridModel, AVGridProps, defaultAVGridState } from "./model/AVGridModel";
import { useComponentModel } from "../../common/classes/model";

const RenderGridStyled = styled(RenderGrid)(
    {
        outline: "none",
        "& .header-cell": {
            paddingLeft: 4,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            backgroundColor: color.grid.headerCellBackground,
            color: color.grid.headerCellColor,
            top: 0,
            zIndex: 1,
            borderBottom: `solid 1px ${color.grid.borderColor}`,
            userSelect: "none",
            "& .header-cell-title": {
                flex: "1 1 auto",
                textAlign: "center",
            },
            "& .flex-space": {
                display: "none",
            },
        },
        "& .data-cell": {
            padding: "0 4px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            backgroundColor: color.grid.dataCellBackground,
            borderBottom: `solid 1px ${color.grid.borderColor}`,
            borderRight: `solid 1px ${color.grid.borderColor}`,
            color: color.grid.dataCellColor,
            outline: "none",
            userSelect: "none",
            '&[data-col="0"]': {
                borderLeft: `solid 1px ${color.grid.borderColor}`,
            },
        },
        "& .row-selected": {
            "&::before": {
                content: "''",
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                backgroundColor: color.grid.selectionColor.selected,
                pointerEvents: "none",
            },
        },
        "& .row-hovered:not(.isEdit)": {
            "&::after": {
                content: "''",
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                backgroundColor: color.grid.selectionColor.hovered,
                pointerEvents: "none",
            },
        },
        "& .data-cell.inSelection::before": {
            content: "''",
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            backgroundColor: color.grid.selectionColor.selected,
            pointerEvents: "none",
        },
        "& .data-cell.inSelectionTop:not(.focused)::before": {
            borderTop: `1px solid ${color.grid.selectionColor.border}`,
        },
        "& .data-cell.inSelectionBottom:not(.focused)::before": {
            borderBottom: `1px solid ${color.grid.selectionColor.border}`,
        },
        "& .data-cell.inSelectionLeft:not(.focused)::before": {
            borderLeft: `1px solid ${color.grid.selectionColor.border}`,
        },
        "& .data-cell.inSelectionRight:not(.focused)::before": {
            borderRight: `1px solid ${color.grid.selectionColor.border}`,
        },
        "& .data-cell.focused::before": {
            content: "''",
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            backgroundColor: color.grid.selectionColor.selected,
            pointerEvents: "none",
            border: `1px solid ${color.grid.selectionColor.border}`,
        },
        "& .cell-check-icon": {
            width: 16,
            height: 16,
        },
        "& .add-row-button": {
            position: "absolute",
            bottom: 1,
            left: 4,
            fontSize: 13,
            cursor: "pointer",
            color: color.text.light,
            opacity: 0.5,
            userSelect: "none",
            whiteSpace: 'nowrap',
            "& .add-row-plus": {
                color: color.icon.disabled,
                marginRight: 4,
            },
            "&:hover": {
                color: color.icon.default,
                "& .add-row-plus": {
                    color: color.icon.default,
                },
                opacity: 1,
            },
        },
    },
    { label: "AVGridRoot" }
);

const LoadingContainerRoot = styled.div({
    flex: "1 1 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
});

function Cell(props: Readonly<TCellRendererProps>) {
    const { col, row, model } = props;

    if (!model.data.columns[col]) return null;

    const Renderer: TCellRenderer =
        row === 0
            ? model.data.columns[col].haderRenderer ?? HeaderCell
            : model.data.columns[col].cellRenderer ?? DataCell;

    const className = clsx({
        "row-selected":
            row > 0 &&
            model.props.selected?.has(model.props.getRowKey(model.data.rows[row - 1])),
        "row-hovered": row > 0 && model.data.hovered.row === row - 1,
    });
    return (
        <Renderer
            {...props}
            row={row - 1}
            model={model}
            className={className}
        />
    );
}

function AVGridComponent<R = any>(
    props: AVGridProps<R>,
    ref?: RefType<AVGridModel<R> | undefined>
) {
    const model = useComponentModel(props, AVGridModel<R>, defaultAVGridState);
    model.useModel();

    useImperativeHandle(ref, () => model);

    const renderCell: RenderCellFunc = useCallback(
        ({ key, ...cellProps }) => {
            return <Cell key={key} {...cellProps} model={model} />;
        },
        [model]
    );

    const contentProps = useMemo<HTMLAttributes<HTMLDivElement>>(() => {
        return {
            onMouseLeave: model.actions.contentMouseLeave,
            onKeyDown: model.actions.contentKeyDown,
            onContextMenu: model.actions.contentContextMenu,
            onBlur: model.actions.contentBlur,
            tabIndex: model.props.setFocus ? 0 : undefined,
        };
    }, [model]);

    if (model.props.loading) {
        return (
            <LoadingContainerRoot>
                <CircularProgress />
            </LoadingContainerRoot>
        );
    }

    let extraElement = null as ReactNode;
    if (model.props.onAddRows) {
        extraElement = (
            <span className="add-row-button" onClick={() => model.actions.addNewRow(true, false)}>
                <span className="add-row-plus">+</span>add {props.entity ?? "row"}
            </span>
        );
    }

    return (
        <HighlightedTextProvider value={model.props.searchString}>
            <AVGridProvider value={model}>
                <RenderGridStyled
                    ref={model.setRenderModel}
                    className={model.props.className}
                    columnCount={model.models.columns.columnCount}
                    rowCount={model.models.rows.rowCount}
                    columnWidth={model.models.columns.getColumnWidth}
                    renderCell={renderCell}
                    stickyTop={1}
                    stickyLeft={model.data.lastIsStatusIndex + 1}
                    rowHeight={model.props.rowHeight}
                    contentProps={contentProps}
                    fitToWidth={model.props.fitToWidth}
                    extraElement={extraElement}
                    growToHeight={model.props.growToHeight}
                    growToWidth={model.props.growToWidth}
                />
                <FilterPoper />
            </AVGridProvider>
        </HighlightedTextProvider>
    );
}

export default forwardRef(AVGridComponent) as <R>(
    props: AVGridProps<R> & { ref?: RefType<AVGridModel<R> | undefined> }
) => ReturnType<typeof AVGridComponent>;
