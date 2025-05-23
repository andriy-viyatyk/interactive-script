import React, { createContext, SetStateAction, useContext } from "react";

// Define the type for the useItemState hook
export type UseItemStateFn<T = any> = (
    itemId: string,
    stateName: string,
    defaultState: T
) => [T, (value: SetStateAction<T>) => void];

// Create the context with undefined as default
const OutputViewContext = createContext<UseItemStateFn | undefined>(undefined);

// Provider component
export const OutputViewProvider = ({
    useItemState,
    children,
}: {
    useItemState: UseItemStateFn;
    children: React.ReactNode;
}) => (
    <OutputViewContext.Provider value={useItemState}>
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
    return context(itemId, stateName, defaultState);
}