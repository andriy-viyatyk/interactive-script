import {
    CSSProperties,
    forwardRef,
    HTMLAttributes,
    ReactNode,
    SetStateAction,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
} from "react";
import styled from "@emotion/styled";
import clsx from "clsx";

import {
    CellFocus,
    Column,
    TAVGridContext,
    TCellRenderer,
    TCellRendererProps,
} from "./avGridTypes";
import { RefType, RenderCellFunc, RerenderInfo } from "../RenderGrid/types";
import { AVGridProvider } from "./useAVGridContext";
import RenderGridModel from "../RenderGrid/RenderGridModel";
import RenderGrid from "../RenderGrid/RenderGrid";
import color from "../../theme/color";
import { CircularProgress } from "../CircularProgress";
import { defaultColumnWidth, useColumns } from "./useColumns";
import { useSortColumn } from "./useSortColumn";
import { useRows } from "./useRows";
import { useSelected } from "./useSelected";
import { useHovered } from "./useHovered";
import { HeaderCell } from "./HeaderCell";
import { DataCell } from "./DataCell";
import { useFocus } from "./useFocus";
import { useEditing } from "./useEditing";
import { useCopyPaste } from "./useCopyPaste";
import { HighlightedTextProvider } from "../useHighlightedText";
import { useContextMenu } from "./useContextMenu";

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
            "& .add-row-plus": {
                color: color.icon.disabled,
                marginRight: 4,
            },
            "&:hover": {
                color: color.icon.default,
                "& .add-row-plus": {
                    color: color.icon.default,
                },
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

function Cell(props: TCellRendererProps) {
    const { col, row, context } = props;
    const Renderer: TCellRenderer =
        row === 0
            ? context.columns[col].haderRenderer ?? HeaderCell
            : context.columns[col].cellRenderer ?? DataCell;

    const className = clsx({
        "row-selected":
            row > 0 &&
            context.selected.has(context.getRowKey(context.rows[row - 1])),
        "row-hovered": row > 0 && context.hovered === row - 1,
    });
    return (
        <Renderer
            {...props}
            row={row - 1}
            context={context}
            className={className}
        />
    );
}

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
    focus?: CellFocus;
    setFocus?: (value: SetStateAction<CellFocus | undefined>) => void;
    editRow?: (columnKey: string, rowKey: string, value: any) => void;
    fitToWidth?: boolean;
    onAddRows?: (count: number, insertIndex?: number) => R[];
    onDeleteRows?: (rowKeys: string[]) => void;
    grawToHeight?: CSSProperties["height"];
    grawToWidth?: CSSProperties["height"];
    searchString?: string;
}

function AVGridComponent<R = any>(
    props: AVGridProps<R>,
    ref?: RefType<TAVGridContext | undefined>
) {
    const {
        className,
        columns: propsColumns,
        rows: propsRows,
        configName,
        rowHeight,
        selected: propsSelected,
        setSelected,
        loading,
        getRowKey,
        disableFiltering,
        disableSorting,
        onClick,
        onDoubleClick,
        onCellClass,
        onColumnsChanged,
        focus,
        setFocus,
        editRow,
        fitToWidth,
        onAddRows,
        onDeleteRows,
        searchString,
    } = props;

    const renderGridRef = useRef<RenderGridModel>(null);

    const update = useCallback((rerender?: RerenderInfo) => {
        if (renderGridRef.current) renderGridRef.current.update(rerender);
    }, []);

    useEffect(() => {
        update({ all: true });
    }, [update, propsColumns, propsRows, propsSelected]);

    const { columns, onColumnResize, onColumnsReorder, lastIsStatusIndex } =
        useColumns<R>({
            columns: propsColumns,
            configName,
            update,
            onColumnsChanged,
        });

    const { sortColumn, setSortColumn, rowCompare } = useSortColumn({
        columns,
    });

    const rows = useRows({
        columns,
        rows: propsRows,
        rowCompare,
        sortDirection: sortColumn?.direction,
        searchString,
    });

    useEffect(() => {
        update({ all: true });
    }, [rows, update]);

    const { selected, allSelected } = useSelected({
        rows,
        selected: propsSelected,
        getRowKey,
    });

    const { hovered, setHovered } = useHovered({ update });

    const {
        onMouseDown: onMouseDownFocus,
        onDragStart,
        onDragEnter,
        onDragEnd,
        onAreaKeyDown: onAreaKeyDownFocus,
    } = useFocus({
        rows,
        columns,
        focus,
        setFocus,
        getRowKey,
        renderGridRef,
    });

    const {
        onAreaKeyDown: onAreaKeyDownEditing,
        cellEdit,
        onMouseDown,
        editCell,
    } = useEditing({
        focus,
        rows,
        columns,
        onAreaKeyDown: onAreaKeyDownFocus,
        onMouseDown: onMouseDownFocus,
        renderGridRef,
        getRowKey,
        editRow,
    });

    const { 
        onAreaKeyDown,
        copySelection,
        canPasteFromClipboard,
        pasteFromClipboard,
     } = useCopyPaste({
        onAreaKeyDown: onAreaKeyDownEditing,
        focus,
        setFocus,
        rows,
        columns,
        getRowKey,
        editCell,
        onAddRows,
    });

    const { onAreaContextMenu } = useContextMenu({
        focus,
        rows,
        columns,
        getRowKey,
        copySelection,
        onAddRows,
        onDeleteRows,
        canPasteFromClipboard,
        pasteFromClipboard,
    });

    const getColumnWidth = useCallback(
        (idx: number) => columns[idx]?.width ?? defaultColumnWidth,
        [columns]
    );

    const context: TAVGridContext = useMemo(
        () => ({
            update,
            columns,
            onColumnResize,
            onColumnsReorder,
            sortColumn,
            setSortColumn,
            rows,
            selected,
            setSelected,
            allSelected,
            hovered,
            setHovered,
            getRowKey,
            disableFiltering,
            disableSorting,
            onClick,
            onMouseDown,
            onDoubleClick,
            onCellClass,
            focus,
            setFocus,
            onDragStart,
            onDragEnter,
            onDragEnd,
            cellEdit,
            editRow,
        }),
        [
            update,
            columns,
            onColumnResize,
            onColumnsReorder,
            sortColumn,
            setSortColumn,
            rows,
            selected,
            setSelected,
            allSelected,
            hovered,
            setHovered,
            getRowKey,
            disableFiltering,
            disableSorting,
            onClick,
            onMouseDown,
            onDoubleClick,
            onCellClass,
            focus,
            setFocus,
            onDragStart,
            onDragEnter,
            onDragEnd,
            cellEdit,
            editRow,
        ]
    );

    useImperativeHandle(ref, () => context);

    const renderCell: RenderCellFunc = useCallback(
        ({ key, ...cellProps }) => {
            return <Cell key={key} {...cellProps} context={context} />;
        },
        [context]
    );

    const contentProps = useMemo<HTMLAttributes<HTMLDivElement>>(() => {
        return {
            onMouseLeave: () => setHovered(-1),
            tabIndex: setFocus ? 0 : undefined,
            onKeyDown: onAreaKeyDown,
            onContextMenu: onAreaContextMenu,
        };
    }, [onAreaContextMenu, onAreaKeyDown, setFocus, setHovered]);

    if (loading) {
        return (
            <LoadingContainerRoot>
                <CircularProgress />
            </LoadingContainerRoot>
        );
    }

    let extraElement = null as ReactNode;
    if (onAddRows) {
        extraElement = (
            <span className="add-row-button" onClick={() => onAddRows(1)}>
                <span className="add-row-plus">+</span>add row
            </span>
        );
    }

    return (
        <HighlightedTextProvider value={searchString}>
            <AVGridProvider value={context}>
                <RenderGridStyled
                    ref={renderGridRef}
                    className={className}
                    columnCount={columns.length}
                    rowCount={rows.length + 1}
                    columnWidth={getColumnWidth}
                    renderCell={renderCell}
                    stickyTop={1}
                    stickyLeft={lastIsStatusIndex + 1}
                    rowHeight={rowHeight}
                    contentProps={contentProps}
                    fitToWidth={fitToWidth}
                    extraElement={extraElement}
                    grawToHeight={props.grawToHeight}
                    grawToWidth={props.grawToWidth}
                />
            </AVGridProvider>
        </HighlightedTextProvider>
    );
}

export default forwardRef(AVGridComponent) as <R>(
    props: AVGridProps<R> & { ref?: RefType<TAVGridContext | undefined> }
) => ReturnType<typeof AVGridComponent>;
