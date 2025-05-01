/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-shadow */
import { useEffect, useRef } from 'react';
import { IState, TComponentState } from './state';

export interface IModel<T> {
    state: IState<T>;
}

export class TModel<T> implements IModel<T> {
    state: IState<T>;
    postCreate?: () => void;

    constructor(
        modelState: IState<T> | (new (defaultState: T) => IState<T>),
        defaultState?: T,
    ) {
        if (typeof modelState === 'function') {
            if (defaultState === undefined) {
                throw new Error(
                    'defaultState should be provided when modelState is State class.',
                );
            }
            // eslint-disable-next-line new-cap
            this.state = new modelState(defaultState);
        } else {
            this.state = modelState;
        }
        setTimeout(() => this.postCreate?.(), 0);
    }
}

export interface IDialogModel<T = any, R = any> extends IModel<T> {
    close: (result: R | undefined) => void;
    result: Promise<R | undefined>;
    onClose?: (result: R | undefined) => void;
}

export class TDialogModel<T = any, R = any>
    extends TModel<T>
    implements IDialogModel<T, R>
{
    close = (result: R | undefined) => {
        this.onClose?.(result);
    };
    result: Promise<R | undefined> = Promise.resolve(undefined);
    onClose?: (result: R | undefined) => void = undefined;
}

export class TComponentModel<T, P> extends TModel<T> {
    props!: P;
    oldProps?: P;
    isFirstUse = true;
    isLive = true;
    setProps?: (props: P) => void | Promise<void>;
    mapProps?: (props: P) => P;
    onUnmount?: () => void;

    setPropsInternal = (props: P) => {
        this.oldProps = this.props;
        this.props = this.mapProps ? this.mapProps(props) : props;
        return this.setProps?.(this.props);
    };

    onUnmountInternal = () => {
        this.isLive = false;
        this.onUnmount?.();
    };
}

function createModel<T, M extends TModel<T>>(
    model:
        | M
        | (new (
              modelState: IState<T> | (new (defaultState: T) => IState<T>),
              defaultState?: T,
          ) => M),
    modelState: IState<T> | (new (defaultState: T) => IState<T>),
    defaultState?: T,
): M {
    if (typeof model === 'function') {
        // eslint-disable-next-line new-cap
        return new model(modelState, defaultState);
    }
    return model;
}

export function useModel<T, M extends TModel<T>>(
    model:
        | M
        | (new (
              modelState: IState<T> | (new (defaultState: T) => IState<T>),
              defaultState?: T,
          ) => M),
    // eslint-disable-next-line default-param-last
    modelState:
        | IState<T>
        | (new (defaultState: T) => IState<T>) = TComponentState<T>,
    defaultState?: T,
): M {
    const modelRef = useRef<M>(undefined);
    if (!modelRef.current) {
        modelRef.current = createModel(model, modelState, defaultState);
    }

    return modelRef.current;
}

export function useComponentModel<T, P, M extends TComponentModel<T, P>>(
    props: P,
    model:
        | M
        | (new (
              modelState: IState<T> | (new (defaultState: T) => IState<T>),
              defaultState?: T,
          ) => M),
    defaultState?: T,
): M {
    const controlModel = useModel(model, TComponentState<T>, defaultState);
    controlModel.setPropsInternal(props);
    controlModel.isFirstUse = false;

    useEffect(
        () => {
            controlModel.isLive = true;
            return () => {
                controlModel.onUnmountInternal();
            }
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return controlModel;
}
