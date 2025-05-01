import { TDialogModel } from "../common/classes/model";
import { IDialogViewData } from "../common/classes/view";
import { PopperPosition } from "../controls/Popper";

export class TPopperModel<T = any, R = any> extends TDialogModel<T, R> {
    position: PopperPosition = {};
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IPopperViewData<
    // eslint-disable-next-line no-use-before-define
    M extends TPopperModel<T> = TPopperModel,
    T = any
> extends IDialogViewData<M, T> {}
