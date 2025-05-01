import React, { SetStateAction, useRef } from 'react';
import { create } from 'zustand';
import { useStoreWithEqualityFn } from "zustand/traditional";
import { produce } from 'immer';

import { resolveState } from '../utils/utils';

interface IUse<T> {
    (): T;
    <R>(selector: (state: T) => R): R;
}

export type IState<T> = {
    get: () => T;
    set: React.Dispatch<SetStateAction<T>>;
    use: IUse<T>;
    update: (updateDraft: (state: T) => void) => void;
    clear: () => void;
    subscribe: (listener: () => void) => () => void;
};

const isObject = (value: any) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isArray = (value: any) => Array.isArray(value);

function compareSelection(a: any, b: any): boolean {
    if (!isObject(a) || isArray(a) || (a instanceof Date) 
        || (a instanceof RegExp) || (a instanceof Map) || (a instanceof Set)
    ) {
        return a === b;
    }

    if (isObject(a) && isObject(b)) {
        if (Object.keys(a).length !== Object.keys(b).length) {
            return false;
        }

        return Object.getOwnPropertyNames(a).every(key => 
            Object.prototype.hasOwnProperty.call(b, key) && compareSelection(a[key], b[key])
        );
    }

    return a === b;
}

export class TOneState<T> implements IState<T> {
    private readonly store;
    private listeners: (() => void)[] = [];
    defaultState;

    constructor(defaultState: T) {
        this.defaultState = defaultState;
        this.store = create<T>(() => defaultState);
    }

    private readonly stateChanged = () => {
        this.listeners.forEach((listener) => listener());
    }

    get = () => this.store.getState();
    set = (setter: SetStateAction<T>) => {
        const newState = resolveState(setter, () => this.store.getState());
        this.store.setState(newState, true);
        this.stateChanged();
    };

    use: IUse<T> = <R>(selector?: (state: T) => R) => {
        return selector
            // eslint-disable-next-line react-hooks/rules-of-hooks
            ? useStoreWithEqualityFn(this.store, state => selector(state), compareSelection)
            : this.store(state => state)
    };

    update = (updateDraft: (state: T) => void) => {
        this.set(
            produce(this.store.getState(), (draft) => {
                updateDraft(draft as T);
            }),
        );
    };

    clear = () => {
        this.set(this.defaultState);
    };

    subscribe = (listener: () => void) => {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        }
    };
}

export class TGlobalState<T> extends TOneState<T> {}

export class TComponentState<T> extends TOneState<T> {}

export function useComponentState<T>(defaultState: T): IState<T> {
    const stateRef = useRef<IState<T>>(undefined);
    if (!stateRef.current) {
        stateRef.current = new TComponentState(defaultState);
    }
    return stateRef.current as IState<T>;
}