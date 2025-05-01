import { TGlobalState } from '../common/classes/state';
import { Views } from '../common/classes/view';
import { IPopperViewData } from './types';

const popperState = new TGlobalState<IPopperViewData | undefined>(undefined);

export function Poppers() {
    const popper = popperState.use();

    if (!popper) {
        return null;
    }

    return Views.renderView(popper.viewId, {
        model: popper.model,
        className: 'dialog',
    });
}

export async function showPopper<R>(data: IPopperViewData): Promise<R> {
    data.model.result = new Promise<R>((resolve) => {
        data.model.onClose = (res) => {
            if (popperState.get() === data) {
                popperState.set(undefined);
            }
            resolve(res);
        };
        popperState.set(data);
    });

    return data.model.result;
}

export const closePopper = (viewId: symbol) => {
    const currentDialog = popperState.get();
    if (currentDialog?.viewId === viewId) {
        currentDialog?.model.close(currentDialog);
    }
};
