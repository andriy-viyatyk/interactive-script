import { useMemo } from "react";

export function useClone<T>(value: T): T {
    return useMemo(() => {
        if (!value || typeof value !== 'object') {
            return value;
        }
        return JSON.parse(JSON.stringify(value));
    }, [value]);
}