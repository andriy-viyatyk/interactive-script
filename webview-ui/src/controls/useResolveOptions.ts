import { useEffect, useRef, useState } from "react";

export function useResolveOptions<T>(valueOrPromise: T[] | Promise<T[]> | (() => T[]) | (() => Promise<T[]>)): [T[], boolean] {
    const [value, setValue] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const requestRef = useRef<Date>(undefined)

    useEffect(() => {
        let live = true;
        const valToResolve = (typeof valueOrPromise === 'function')
            ? valueOrPromise()
            : valueOrPromise;
        if (!(valToResolve instanceof Promise)){
            setValue(valToResolve);
        } else {
            setLoading(true);
            const startTime = new Date();
            requestRef.current = startTime;
            valToResolve.then(v => {
                if (requestRef.current === startTime && live) {
                    setValue(v);
                    setLoading(false);
                }
            })
        }
        return () => { live = false };
    }, [valueOrPromise])

    const returnValue = !(valueOrPromise instanceof Promise) && !(typeof valueOrPromise === 'function') 
        ? valueOrPromise 
        : value;

    return [returnValue, loading];
}