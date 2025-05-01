import clsx from "clsx";
import React, { createContext, ReactNode, useContext } from "react";

const HighlightedTextContext = createContext<string | undefined>(undefined);
export const HighlightedTextProvider = HighlightedTextContext.Provider;

export function useHighlightedText(): string | undefined {
	const highlightedTextContext = useContext(HighlightedTextContext);
	return highlightedTextContext;
}

export const highlightText = (substring?: string, text?: string, highlightClassName?: string): ReactNode => {
	if (!substring) return text;
	const substrings = substring
		.split(" ")
		.map(s => s.trim())
		.filter(s => s);
	substring = substrings.shift();
	if (!substring) return text;

	const escaped = substring.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const expression = new RegExp(`(${escaped})`, "gi");

	return text?.split(expression).map((part, index) => {
		const className = part.match(expression) ? clsx("highlighted-text", highlightClassName) : "";

		return className ? (
			<span key={index} className={className}>
				{part}
			</span>
		) : substrings.length ? (
			<React.Fragment key={index}>{highlightText(substrings.join(" "), part)}</React.Fragment>
		) : part.startsWith(" ") ? (
			<React.Fragment key={index}>&nbsp;{part.substring(1)}</React.Fragment>
		) : part.endsWith(" ") ? (
			<React.Fragment key={index}>{part.substring(0, part.length - 1)}&nbsp;</React.Fragment>
		) : (
			<React.Fragment key={index}>{part}</React.Fragment>
		);
	});
};

export type GetPropertyTextValue<T> = (obj: T) => string;

export function searchMatch<T = any>(
	obj: T,
	substringsLower?: string[],
	getProps?: GetPropertyTextValue<T>[],
) {
	if (!(getProps?.length && substringsLower?.length)) return true;

	const isMatch = substringsLower.every(ss => 
		getProps.some(gp => gp(obj).toLowerCase().includes(ss))
	);

	return isMatch;
}
