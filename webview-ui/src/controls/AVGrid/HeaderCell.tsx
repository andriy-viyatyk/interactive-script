import React, { useCallback, useRef } from 'react';
import styled from '@emotion/styled';
import clsx from 'clsx';
import { useDrag, useDrop } from 'react-dnd';

import color from '../../theme/color';
import { TCellRendererProps, TSortDirection } from './avGridTypes';
import {
    FilterArrowDownIcon,
    FilterArrowUpIcon,
    FilterTableIcon,
} from '../../theme/icons';
import { Button } from '../Button';
import { useFilters } from './filters/useFilters';

const HeaderCellRoot = styled.div(
    {
        position: 'relative',
        alignItems: 'center',
        backgroundColor: color.grid.headerCellBackground,
        paddingRight: 10,
        boxSizing: 'border-box',
        '&.header-resizible': {
            '&::after': {
                content: '""',
                cursor: 'col-resize',
                position: 'absolute',
                insetBlockStart: 0,
                insetInlineEnd: 0,
                insetBlockEnd: 0,
                inlineSize: '10px',
            },
            '&:hover::after': {
                background: `linear-gradient(
                    to bottom,
                    transparent 0%,
                    transparent 20%,
                    ${color.border.default} 30%,
                    transparent 40%,
                    ${color.border.default} 50%,
                    transparent 60%,
                    ${color.border.default} 70%,
                    transparent 80%,
                    transparent 100%
                )`, // Creates 3 horizontal lines
                backgroundSize: '4px 100%', // Restrict dashes to 4px width
                backgroundPosition: 'center', // Center the dashes horizontally
                backgroundRepeat: 'no-repeat',
            },
        },
        '& .flex-space': {
            flex: '1 1 auto',
        },
        '& .column-filter-button': {
            display: 'none',
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: color.background.dark,
        },
        '&:hover': {
            '& .column-filter-button': {
                display: 'flex',
            },
        },
        '& .header-cell-title': {
            marginRight: 4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
    },
    { label: 'HeaderCellRoot' },
);

function SortIcon({ direction }: { direction?: TSortDirection }) {
    if (direction === 'asc') {
        return <FilterArrowDownIcon width={16} height={16} />;
    }
    if (direction === 'desc') {
        return <FilterArrowUpIcon width={16} height={16} />;
    }
    return null;
}

export function HeaderCell({ key, col, style, context }: TCellRendererProps) {
    const column = context.columns[col];
    const headerRef = useRef<HTMLElement>(undefined);
    const resizingRef = useRef(false);
    const hasResized = useRef(false);
    const { showFilterPoper } = useFilters();

    const handleClick = () => {
        if (hasResized.current) {
            hasResized.current = false;
            return;
        }
        if (context.disableSorting) {
            return;
        }

        context.setSortColumn((old) => {
            if (old?.key === (column.key as string)) {
                return old.direction === 'desc'
                    ? undefined
                    : { key: column.key as string, direction: 'desc' };
            }
            return { key: column.key as string, direction: 'asc' };
        });
        context.update({ all: true });
    };

    function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
        if (event.pointerType === 'mouse' && event.buttons !== 1) {
            return;
        }

        const { currentTarget, pointerId } = event;
        const { right } = currentTarget.getBoundingClientRect();
        const offset = right - event.clientX;

        if (offset > 11) {
            return;
        }
        hasResized.current = true;
        resizingRef.current = true;

        function onPointerMove(e: PointerEvent) {
            e.preventDefault();
            const { left } = currentTarget.getBoundingClientRect();
            const width = e.clientX + offset - left;
            if (width > 0) {
                context.onColumnResize(column?.key as string, width);
            }
        }

        function onLostPointerCapture() {
            currentTarget.removeEventListener('pointermove', onPointerMove);
            currentTarget.removeEventListener(
                'lostpointercapture',
                onLostPointerCapture,
            );
            resizingRef.current = false;
        }

        currentTarget.setPointerCapture(pointerId);
        currentTarget.addEventListener('pointermove', onPointerMove);
        currentTarget.addEventListener(
            'lostpointercapture',
            onLostPointerCapture,
        );
    }

    const [{ isDragging }, drag] = useDrag({
        type: 'COLUMN_DRAG',
        item: { key: column.key },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: () => {
            return !column.isStatusColumn && !resizingRef.current;
        },
    });

    const [{ isOver }, drop] = useDrop({
        accept: ['COLUMN_DRAG', 'FREEZE_DRAG'],
        drop({ key: dropKey }: { key: string }) {
            context.onColumnsReorder(dropKey, column.key as string);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
        canDrop: () => !column.isStatusColumn,
    });

    const filterClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            if (column.filterType) {
                showFilterPoper(
                    {
                        columnKey: column.key as string,
                        columnName: column.name,
                        type: column.filterType,
                        displayFormat: column.displayFormat,
                    },
                    headerRef.current,
                    {
                        x: e.clientX,
                        y: e.clientY,
                    },
                    {
                        x: 4,
                        y: 0,
                    }
                );
            }
        },
        [
            column.filterType,
            column.displayFormat,
            column.key,
            column.name,
            showFilterPoper,
        ]
    );

    return (
        <HeaderCellRoot
            ref={(ref) => {
                headerRef.current = ref as HTMLElement;
                drag(ref);
                drop(ref);
            }}
            key={key}
            style={style}
            className={clsx('header-cell', {
                'header-resizible': column.resizible,
                'is-dragging': isDragging,
                'is-over': isOver,
            })}
            onPointerDown={column.resizible ? onPointerDown : undefined}
            onClick={handleClick}
            qa-cell={`${col}:header`}
            qa-column={column.key}
        >
            <span className="header-cell-title">{column?.name}</span>
            {Boolean(
                context.sortColumn && column.key === context.sortColumn.key,
            ) && <SortIcon direction={context.sortColumn?.direction} />}
            <span className="flex-space" />
            {Boolean(column.filterType) && !context.disableFiltering && (
                <Button
                    size="small"
                    type="icon"
                    className="column-filter-button"
                    onClick={filterClick}
                >
                    <FilterTableIcon />
                </Button>
            )}
        </HeaderCellRoot>
    );
}
