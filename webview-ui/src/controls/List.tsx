import { CSSProperties, ReactElement, ReactNode, useCallback, useEffect, useRef } from "react";
import clsx from "clsx";
import styled from "@emotion/styled";

import RenderGrid from "./RenderGrid/RenderGrid";
import RenderGridModel from "./RenderGrid/RenderGridModel";
import { Percent, RenderCellFunc } from "./RenderGrid/types";
import { defaultOptionGetLabel } from "./utils";
import { CheckIcon } from "../theme/icons";
import { CircularProgress } from "./CircularProgress";
import color from "../theme/color";

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
            color: `${color.icon.default} !important`,
        }
    }
});

const ItemRoot = styled.div({
    paddingLeft: 4,
    cursor: 'pointer',
    backgroundColor: color.background.default,
    '&:hover': {
        filter: 'brightness(0.97)',
    },
    flexDirection: 'row',
    columnGap: 4,
    display: 'inline-flex',
    alignItems: 'center',
    "& .list-icon": {
        margin: 1,
        color: color.icon.default,
    },
    fontSize: 14,
    "&.selected": {
        color: color.background.dark,
    },
    "&.hovered": {
        backgroundColor: color.background.dark,
    },
    "& .item-text": {
        flex: '1 1',
        whiteSpace: 'nowrap',
        // lineHeight: '24px',
        color: color.text.default,
    },
    "& .item-selectedCheckIcon": {
        color: color.icon.default,
        position: 'absolute',
        right: 6,
        bottom: 8,
        width: 16,
        height: 16,
    }
});

const RenderGridRoot = styled(RenderGrid)({
    
});

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
}

const columnWidth = () => '100%' as Percent;

export function List<O = any>(props: Readonly<ListProps<O>>) {
    const gridRef = useRef<RenderGridModel | null>(null);
    const {options, rowHeight, getSelected, getHovered, rowRenderer, onClick, getIcon,
        getLabel: getLabelProps, getOptionClass, loading, emptyMessage, onMouseHover,
        className} = props;

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
                }, optionClass)}
                onClick={() => optionClick(options[index], index)}
                onMouseEnter={() => onMouseHover?.(options[index])}
            >
                {Boolean(icon) && <span className='list-icon'>{icon}</span>}
                <span className="item-text" title={label}>
                    {label}
                </span>
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
            rowHeight={rowHeight || 24}
            renderCell={renderCell}
            overscanRow={2}
            fitToWidth
        />
    )
}