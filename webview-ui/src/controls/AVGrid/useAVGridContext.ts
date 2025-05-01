import { createContext, useContext } from "react";
import { TAVGridContext } from "./avGridTypes";

const AVGridContext =
    createContext<TAVGridContext | undefined>(undefined);
export const AVGridProvider = AVGridContext.Provider;

export function useAVGridContext(): TAVGridContext {
    const avGridContext = useContext(AVGridContext);

    if (avGridContext === undefined) {
        throw new Error(
            "useAVGridContext must be used within AVGridContext"
        );
    }

    return avGridContext;
}