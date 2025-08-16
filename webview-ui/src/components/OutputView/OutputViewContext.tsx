import React, { createContext, SetStateAction, useContext } from "react";
import { TComponentState } from "../../common/classes/state";

// Define the type for the useItemState hook
export type UseItemStateFn<T = any> = (
    itemId: string,
    stateName: string,
    defaultState: T
) => [T, (value: SetStateAction<T>) => void];

export type UseComponentStateFn<T = any> = (
    componentId: string,
    defaultState: T
) => TComponentState<T>;

export interface IOutputViewContext {
    useItemState: UseItemStateFn;
    useComponentState: UseComponentStateFn;
}

// Create the context with undefined as default
const OutputViewContext = createContext<IOutputViewContext | undefined>(undefined);

// Provider component
export const OutputViewProvider = ({
    context,
    children,
}: {
    context: IOutputViewContext;
    children: React.ReactNode;
}) => (
    <OutputViewContext.Provider value={context}>
        {children}
    </OutputViewContext.Provider>
);

// Hook to use the context
export function useItemState<T>(
    itemId: string,
    stateName: string,
    defaultState: T
): [T, (value: SetStateAction<T>) => void] {
    const context = useContext(OutputViewContext);
    if (!context) {
        throw new Error("useItemState must be used within an OutputViewProvider");
    }
    return context.useItemState(itemId, stateName, defaultState);
}

export function useComponentState<T>(
    componentId: string,
    defaultState: T
): TComponentState<T> {
    const context = useContext(OutputViewContext);
    if (!context) {
        throw new Error("useComponentState must be used within an OutputViewProvider");
    }
    return context.useComponentState(componentId, defaultState);
}
