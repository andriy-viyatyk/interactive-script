import React, {
    SetStateAction,
    useCallback,
    useMemo,
} from 'react';

import { Column, TOnColumnResize, TOnColumnsReorder } from './avGridTypes';
import { RerenderInfo } from '../RenderGrid/types';
import { range, resolveState } from '../../common/utils/utils';

export const defaultColumnWidth = 140;
export const columnsConfigKey = (configName: string) =>
    `av-grid-columns-${configName}`;

interface UseColumnsProps<R = unknown> {
    columns: Column<R>[];
    configName?: string;
    update?: (rerender?: RerenderInfo) => void;
    onColumnsChanged?: () => void;
}

export function useColumns<R = unknown>(props: UseColumnsProps<R>) {
    const {
        columns: propsColumns,
        update,
        onColumnsChanged,
    } = props;

    const [columns, setColumns] = React.useState<Column<R>[]>(propsColumns);

    const setColumnsProxy = useCallback(
        (cols: Column<R>[] | SetStateAction<Column<R>[]>): void => {
            setColumns((old) => {
                const newColumns = resolveState(cols, () => old);
                return newColumns;
            });
            onColumnsChanged?.();
        },
        [onColumnsChanged],
    );

    React.useEffect(() => {
        setColumns(propsColumns);
    }, [propsColumns]);

    const onColumnResize = useCallback<TOnColumnResize>(
        (columnKey, width) => {
            setColumnsProxy((oldColumns) => {
                return oldColumns.map((c) =>
                    c.key === columnKey ? { ...c, width } : c,
                );
            });
        },
        [setColumnsProxy],
    );

    const onColumnsReorder = React.useCallback<TOnColumnsReorder>(
        (sourceKey, targetKey) => {
            setColumnsProxy((old) => {
                const sourceColumnIndex = old.findIndex(
                    (c) => c.key === sourceKey,
                );
                const targetColumnIndex = old.findIndex(
                    (c) => c.key === targetKey,
                );
                const reorderedColumns = [...old];

                reorderedColumns.splice(
                    targetColumnIndex,
                    0,
                    reorderedColumns.splice(sourceColumnIndex, 1)[0],
                );

                update?.({
                    columns: range(sourceColumnIndex, targetColumnIndex),
                });
                return reorderedColumns;
            });
        },
        [setColumnsProxy, update],
    );

    const lastIsStatusIndex = useMemo(() => {
        let res = -1;
        columns.forEach((c, idx) => {
            if (c.isStatusColumn) res = idx;
        });
        return res;
    }, [columns]);

    return useMemo(
        () => ({
            columns: columns.filter((c) => !c.hidden),
            onColumnResize,
            onColumnsReorder,
            lastIsStatusIndex,
        }),
        [columns, onColumnResize, onColumnsReorder, lastIsStatusIndex],
    );
}
