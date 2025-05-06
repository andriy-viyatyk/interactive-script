import { SetStateAction } from 'react';

export function resolveState<S>(
    newState: SetStateAction<S>,
    getPrevState: () => S,
): S {
    return typeof newState === 'function'
        ? (newState as (prev: S) => S)(getPrevState())
        : newState;
}

// Utility function to enforce the constraint
export function createStringEnumArray<T extends { [key: string]: string }>(enumObj: T): (T[keyof T])[] {
    return Object.values(enumObj) as (T[keyof T])[];
}

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toClipboard(text: string): void {
    navigator.clipboard.writeText(text);
}

export async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => { setTimeout(resolve, ms) });
}

export const range = (from: number, to: number) => from <= to
    ? Array.from({ length: to - from + 1 }, (_, i) => from + i)
    : Array.from({ length: from - to + 1 }, (_, i) => to + i);

export const isNullOrUndefined = (v: any) => v === null || v === undefined;

export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timeoutId: any = null;

    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
}

export function throttle<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
    let isThrottled = false;

    return (...args: Parameters<T>) => {
        if (!isThrottled) {
            isThrottled = true;
            func(...args);

            setTimeout(() => {
                isThrottled = false;
            }, delay);
        }
    };
}

export function parseJson<T = any>(jsonString: string): T | undefined {
    try {
        return JSON.parse(jsonString) as T;
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return undefined;
    }
}