import { createContext, useContext } from "react";
import { AVGridModel } from "./model/AVGridModel";

const AVGridContext =
    createContext<AVGridModel<any> | undefined>(undefined);
export const AVGridProvider = AVGridContext.Provider;

export function useAVGridContext(): AVGridModel<any> {
    const avGridContext = useContext(AVGridContext);

    if (avGridContext === undefined) {
        throw new Error(
            "useAVGridContext must be used within AVGridContext"
        );
    }

    return avGridContext;
}