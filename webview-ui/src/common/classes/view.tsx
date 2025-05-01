/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-empty-interface */
import React, { ReactElement } from "react";
import styled from "@emotion/styled";
import clsx from "clsx";
import { TDialogModel, TModel } from "./model";

export interface DefaultProps {
    className?: string;
}

export interface ViewProps<M extends TModel<T>, T = any>
    extends DefaultProps {
    model: M;
}

export type ViewPropsRO<M extends TModel<T>, T = any> = Readonly<ViewProps<M, T>>;

export interface IViewData<M extends TModel<T>, T = any> {
    viewId: Symbol;
    model: M;
}

export interface IDialogViewData<
    M extends TDialogModel<T> = TDialogModel,
    T = any
> extends IViewData<M, T> {}

export type DefaultView = React.FC<ViewProps<TModel<any>>>;

interface IViewRegistration<T extends DefaultView = DefaultView> {
    viewId: Symbol;
    Component: T;
}

const views: Map<Symbol, IViewRegistration> = new Map<
    Symbol,
    IViewRegistration
>();

const registerView = <T extends DefaultView = DefaultView>(
    viewId: Symbol,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    View: T
) => {
    views.set(viewId, { viewId, Component: View });
};

const renderView = (viewId: Symbol, props: ViewProps<any>): ReactElement | null => {
    if (!views.has(viewId)) {
        throw new Error(`View "${viewId.toString()}" not registered.`);
    }

    const Component = views.get(viewId)?.Component;
    return Component ? <Component {...props} /> : null;
};

export const Views = {
    registerView,
    renderView,
};

const ViewRoot = styled.div({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    '&.isActive': {
        zIndex: 10,
    }
});

export function View<M extends TModel<T>, T = any>(props: IViewData<M, T> & {active: boolean}) {
    return <ViewRoot className={clsx({isActive: props.active})}>{renderView(props.viewId, { model: props.model })}</ViewRoot>
}