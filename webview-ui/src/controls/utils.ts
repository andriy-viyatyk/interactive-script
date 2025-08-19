import { useEffect, useMemo, useState } from "react";
import { isNullOrUndefined } from "../common/utils/utils";

export const emptyLabel = "(empty)";

export const defaultOptionGetLabel = (o: any): string => {
    let value = "";
    if (!isNullOrUndefined(o)) {
        switch (typeof o) {
            case "boolean":
                value = o.toString();
                break;
            case "object":
                value = o.label ?? o.toString?.() ?? "";
                break;
            default:
                value = o.toString?.() ?? "";
        }
    }

    return isNullOrUndefined(value) || value === "" ? emptyLabel : value;
};

export function useFilteredOptions<O = any>(
    options: readonly O[],
    searchString?: string,
    getLabel?: (o: O, index: number) => string
) {
    return useMemo(() => {
        if (!searchString) {
            return options;
        }
        const searchStringLower = searchString.toLocaleLowerCase().split(" ").map(s => s.trim());
        return options.filter((o, idx) => {
            const label: string = getLabel
                ? getLabel(o, idx)
                : defaultOptionGetLabel(o);
            return (
                label &&
                label.toLowerCase &&
                searchStringLower.every(term => label.toLowerCase().includes(term))
            );
        });
    }, [options, searchString, getLabel]);
}

export async function resolveValue<T>(value: T | (() => T | Promise<T>)): Promise<T> {
	let res = value;
    if (typeof res === 'function') {
        res = (res as any)();
    }
	if (res && (res as any).then) {
		res = await res;
	}
	return res as T;
}

export type SelectOptionsResult<T> = {
	options: T[];
	loading: boolean;
};

export function useSelectOptions<T>(
	selectFrom?: readonly T[] | (() => T[] | Promise<T[]>),
	open?: boolean,
): SelectOptionsResult<T> {
	const [options, setOptions] = useState<T[]>([]);
	const [loading, setLoading] = useState(false);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		setLoaded(false);
		setOptions([]);
	}, [selectFrom]);

	useEffect(() => {
		let live = true;

		if (!open || loaded) {
			return;
		}

		if (!selectFrom) {
			setOptions([]);
		} else if (Array.isArray(selectFrom)) {
			setOptions(selectFrom);
		} else if (typeof selectFrom === "function") {
			setLoading(true);
			resolveValue(selectFrom).then(res => {
				if (live) {
					setLoading(false);
					setLoaded(true);
					setOptions(res);
				}
			});
		}

		return () => {
			live = false;
		};
	}, [open, selectFrom, loaded]);

	return { options, loading };
}

export function beep() {
	try {
		const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
		const oscillator = audioCtx.createOscillator();
		const gainNode = audioCtx.createGain();

		oscillator.frequency.value = 440; // frequency
		
		oscillator.type = 'sine'; // type of waveform "sine", "square", etc.
		gainNode.gain.value = 0.3; // volume [0.0, 1.0]

		oscillator.connect(gainNode);
		gainNode.connect(audioCtx.destination);
		oscillator.start();
		
		// Set a very short fade-out to prevent a click sound at the end.
		gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
		oscillator.stop(audioCtx.currentTime + 0.2); // beep time
	} catch {
		// Handle any errors that may occur
	}
}