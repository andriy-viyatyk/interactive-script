import styled from '@emotion/styled';
import React, { CSSProperties, ReactNode, useCallback, useEffect, useMemo } from 'react';
import clsx from 'clsx';

import RenderGrid from './RenderGrid/RenderGrid';
import { Percent, RenderCellFunc } from './RenderGrid/types';
import { Popper, PopperProps, PopperRoot } from './Popper';
import color from '../theme/color';
import RenderGridModel from './RenderGrid/RenderGridModel';

const PopupMenuRoot = styled(PopperRoot)<{ height?: CSSProperties['height'] }>(
    (props) => ({
        minWidth: 140,
        minHeight: 26,
        maxHeight: 800,
        maxWidth: 800,
        padding: '4px 0',
        height: props.height,
        display: 'flex',
        flexDirection: 'column',
        '& .popup-menu-item': {
            display: 'flex',
            alignItems: 'center',
            columnGap: 8,
            color: color.text.default,
            cursor: 'pointer',
            padding: '0 4px',
            '& .popup-menu-item-icon': {
                display: 'flex',
                alignItems: 'center',
                '& svg': {
                    width: 16,
                    height: 16,
                },
            },
            '& .popup-menu-item-label': {},
            '&:hover': {
                backgroundColor: color.background.selection,
                color: color.text.selection,
            },
            '&.disabled': {
                '& .popup-menu-item-label': {
                    color: color.text.light,
                },
                '& .popup-menu-item-icon': {
                    '& svg': {
                        color: color.icon.disabled,
                    },
                },
                cursor: 'default',
                backgroundColor: color.background.default,
            },
            '&.startGroup': {
                borderTop: `1px solid ${color.border.light}`,
            },
        },
    }),
    { label: 'PopupMenuRoot' },
);

export interface MenuItem {
    label: string;
    onClick?: (e: React.MouseEvent<Element>) => void;
    disabled?: boolean | Promise<boolean>;
    icon?: ReactNode;
    invisible?: boolean | Promise<boolean>;
    startGroup?: boolean;
    title?: string;
}

export interface PopupMenuProps extends PopperProps {
    items: MenuItem[];
}

const columnWidth = () => '100%' as Percent;
const rowHeight = 24;
const maxHeight = 500;
const whiteSpaceY = 0;

export function PopupMenu(props: PopupMenuProps) {
    const { items: itemsProps, onClose: propsOnClose, ...popperProps } = props;
    const [promiseMap, setPromiseMap] = React.useState<Map<Promise<any>, boolean>>(new Map());
    const gridRef = React.useRef<RenderGridModel>(null);

    useEffect(() => {
        let isLive = true;
        const promises = [] as Promise<any>[];
        itemsProps.forEach((item) => {
            if (item.invisible instanceof Promise) {
                promises.push(item.invisible);
            }
            if (item.disabled instanceof Promise) {
                promises.push(item.disabled);
            }
        })
        const results = Promise.all(promises);
        results.then((values) => {
            if (!isLive) return;
            const newMap = new Map<Promise<any>, boolean>();
            values.forEach((value, index) => {
                newMap.set(promises[index], value);
            });
            setPromiseMap(newMap);
        });

        return () => {
            isLive = false;
        }
    }, [itemsProps]);

    const promiseValue = useCallback((value: boolean | Promise<boolean> | undefined, defaultValue: boolean) => {
        if (value === undefined) return undefined;
        if (value instanceof Promise) {
            return promiseMap.get(value) ?? defaultValue;
        }
        return value;
    }, [promiseMap]);

    useEffect(() => {
        gridRef.current?.update({ all: true });
    }, [promiseMap]);

    const items = useMemo(() => {
        const prepared = [...itemsProps];
        prepared.forEach((item, i) => {
            if (item.startGroup && promiseValue(item.invisible, true) && i < prepared.length - 1) {
                prepared[i + 1] = { ...prepared[i + 1], startGroup: true };
            }
        });
        return prepared.filter((item) => !item.invisible);
    }, [itemsProps, promiseValue]);

    const popupHeight = Math.min(
        rowHeight * items.length + whiteSpaceY,
        maxHeight,
    );

    const onClose = useCallback(() => {
        propsOnClose?.();
    }, [propsOnClose]);

    const renderCell: RenderCellFunc = (p) => {
        const item = items[p.row];
        return (
            <div
                style={p.style}
                key={p.key}
                className={clsx('popup-menu-item', {
                    disabled: promiseValue(item.disabled, true),
                    startGroup: item.startGroup && p.row > 0,
                })}
                onClick={(e) => {
                    e.stopPropagation();
                    if (!promiseValue(item.disabled, true)) {
                        onClose();
                        item.onClick?.(e);
                    }
                }}
                title={item.title}
            >
                <span className="popup-menu-item-icon">
                    {Boolean(item.icon) && item.icon}
                </span>
                <span className="popup-menu-item-label">{item.label}</span>
            </div>
        );
    };

    return (
        <Popper onClose={onClose} {...popperProps}>
            <PopupMenuRoot height={popupHeight}>
                <RenderGrid
                    ref={gridRef}
                    rowCount={items.length}
                    columnCount={1}
                    columnWidth={columnWidth}
                    rowHeight={rowHeight}
                    fitToWidth
                    renderCell={renderCell}
                    whiteSpaceY={whiteSpaceY}
                />
            </PopupMenuRoot>
        </Popper>
    );
}
