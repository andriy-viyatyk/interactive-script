import { CSSProperties, ForwardedRef, forwardRef, ReactElement, ReactNode, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import clsx from "clsx";
import styled from "@emotion/styled";

import RenderGrid from "./RenderGrid/RenderGrid";
import RenderGridModel from "./RenderGrid/RenderGridModel";
import { Percent, RenderCellFunc } from "./RenderGrid/types";
import { defaultOptionGetLabel } from "./utils";
import { CheckIcon } from "../theme/icons";
import { CircularProgress } from "./CircularProgress";
import color from "../theme/color";
import { OverflowTooltipText } from "./OverflowTooltipText";

const NoRowsRoot = styled.div({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    "& >": {
        marginRight: 4,
    },
    "& .loading-indicator": {
        width: 16, 
        height: 16,
        margin: 4,
        "& svg": {
            color: `${color.icon.light} !important`,
        }
    }
});

const ItemRoot = styled.div({
    paddingLeft: 4,
    cursor: 'pointer',
    color: color.text.default,
    '&:hover': {
        backgroundColor: color.background.selection,
        color: color.text.selection,
    },
    flexDirection: 'row',
    columnGap: 6,
    display: 'inline-flex',
    alignItems: 'center',
    overflow: 'hidden',
    "&.selected": {
    },
    "&.hovered": {
    },
    "& .item-text": {
        flex: '1 1',
        whiteSpace: 'nowrap',
    },
    "& .selectedCheckIcon": {
        position: 'absolute',
        right: 6,
        top: 4,
        width: 16,
        height: 16,
    }
});

const RenderGridRoot = styled(RenderGrid)({
    
});

export const listItemHeight = 24;

export type ListOptionRenderer<O> = (props: {
    index: number,
    key: string | number,
    style: CSSProperties,
    onClick: (row: O, index?: number) => void,
    row: O,
    selected: boolean,
    hovered: boolean,
    onMouseHover?: (value: O, index?: number) => void;
}) => ReactNode;

export interface ListProps<O> {
    options: readonly O[];
    getLabel?: (value: O, index?: number) => string;
    getIcon?: (value: O, index?: number) => ReactElement;
    getSelected?: (value: O) => boolean;
    onClick?: (value: O, index?: number) => void;
    getOptionClass?: (value: O, index?: number) => string;
    emptyMessage?: string | ReactElement;
    getHovered?: (value: O) => boolean;
    onMouseHover?: (value: O, index?: number) => void;
    loading?: boolean;
    rowHeight?: number;
    rowRenderer?: ListOptionRenderer<O>;
    className?: string;
    growToHeight?: CSSProperties['height'];
    whiteSpaceY?: number;
}

const columnWidth = () => '100%' as Percent;

export interface ListRef {
    grid: RenderGridModel | null;
}

function ListComponent<O = any>(props: Readonly<ListProps<O>>, ref: ForwardedRef<ListRef>) {
    const gridRef = useRef<RenderGridModel | null>(null);
    const {options, rowHeight, getSelected, getHovered, rowRenderer, onClick, getIcon,
        getLabel: getLabelProps, getOptionClass, loading, emptyMessage, onMouseHover,
        className, growToHeight, whiteSpaceY} = props;

    useEffect(() => {
        gridRef.current?.update({all: true});
    }, 
        [options, rowHeight, getSelected, getHovered, rowRenderer, onClick, getIcon,
        getLabelProps, getOptionClass, loading, emptyMessage, onMouseHover,
        className]
    )

    const getLabel = useCallback(
        (option: O, index: number) => {
            return getLabelProps
                ? getLabelProps(option, index)
                : defaultOptionGetLabel(option);
        },
        [getLabelProps]
    );

    const optionClick = useCallback((row: O, index?: number) => {
        onClick?.(row, index);
        gridRef.current?.update({all: true});
    }, [onClick])

    useImperativeHandle(ref, () => ({
        grid: gridRef.current,
    }), []);

    const renderCell = useCallback<RenderCellFunc>(({row: index, key, style}) => {
        const isSelected = getSelected ? getSelected(options[index]) : false;
        const isHovered = getHovered ? getHovered(options[index]) : false;
        const icon = getIcon?.(options[index], index);
        const label = getLabel(options[index], index);
        const optionClass = getOptionClass?.(options[index], index);

        const res = rowRenderer?.({
            index,
            key,
            style,
            onClick: optionClick,
            row: options[index],
            selected: isSelected,
            hovered: isHovered,
            onMouseHover,
        })
        return res ?? (
            <ItemRoot 
                key={key} 
                style={{...style}} 
                className={clsx({
                    selected: isSelected,
                    hovered: isHovered,
                }, "list-item", optionClass)}
                onClick={() => optionClick(options[index], index)}
                onMouseEnter={() => onMouseHover?.(options[index])}
            >
                {Boolean(icon) && icon}
                <OverflowTooltipText className="item-text">{label}</OverflowTooltipText>
                {isSelected &&
                    <CheckIcon className="selectedCheckIcon"/>
                }
            </ItemRoot>
        )
    }, [options, rowRenderer, optionClick, getSelected, getHovered, getIcon, getLabel, getOptionClass, 
        onMouseHover])

    if (loading) {
        return (
            <NoRowsRoot>
                <CircularProgress className="loading-indicator"/> Loading...
            </NoRowsRoot>
        )
    }

    if (!(options.length)){
        return (
            <NoRowsRoot>
                {emptyMessage ?? 'No rows'}
            </NoRowsRoot>
        );
    }

    return (
        <RenderGridRoot
            ref={gridRef}
            columnCount={1}
            rowCount={options.length}
            columnWidth={columnWidth}
            rowHeight={rowHeight || listItemHeight}
            renderCell={renderCell}
            overscanRow={2}
            fitToWidth
            className={className}
            growToHeight={growToHeight}
            whiteSpaceY={whiteSpaceY}
        />
    )
};

export const List = forwardRef(ListComponent) as <O = any>(
  props: React.PropsWithoutRef<ListProps<O>> & React.RefAttributes<ListRef>
) => React.ReactElement | null;