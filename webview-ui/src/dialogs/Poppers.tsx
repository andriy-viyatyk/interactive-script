import React from 'react';
import { TGlobalState } from '../common/classes/state';
import { Views } from '../common/classes/view';
import { IPopperViewData } from './types';

const popperState = new TGlobalState<IPopperViewData[]>([]);

export function Poppers() {
    const poppers = popperState.use();

    if (!poppers.length) {
        return null;
    }

    return poppers.map(popper => (
        <React.Fragment key={popper.viewId.toString()}>
            {Views.renderView(popper.viewId, {
                model: popper.model,
                className: 'dialog',
            })}
        </React.Fragment>
    ));
}

export async function showPopper<R>(data: IPopperViewData): Promise<R> {
    data.model.result = new Promise<R>((resolve) => {
        data.model.onClose = (res) => {
            const poppers = popperState.get();
            if (poppers.includes(data)) {
                popperState.set(poppers.filter(p => p !== data));
            }
            resolve(res);
        };
        popperState.set(s => [...s, data]);
    });

    return data.model.result;
}

export const closePopper = (viewId: symbol) => {
    const currentDialog = popperState.get().find(p => p.viewId === viewId);
    if (currentDialog) {
        currentDialog.model.close(currentDialog);
    }
};

export const visiblePoppers = () => popperState.get();