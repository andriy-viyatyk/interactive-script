import { ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import {
    Placement,
    useFloating,
    VirtualElement,
    offset as floadingOffset,
    flip,
} from "@floating-ui/react";
import styled from "@emotion/styled";
import color from "../theme/color";
import { ResizeHandleIcon } from "../theme/icons";

export const PopperRoot = styled.div({
    backgroundColor: color.background.default,
    border: `1px solid ${color.border.default}`,
    borderRadius: 6,
    boxShadow: color.shadow.default,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    "& .resize-handle": {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 10,
        height: 10,
        cursor: "nwse-resize",
        color: color.icon.light,
    },
});

export interface PopperPosition {
    elementRef?: Element | VirtualElement | null;
    x?: number;
    y?: number;
    placement?: Placement;
    offset?: [number, number]; // [skidding, distance].  *Skidding - shift left/right if pupup at the bottom/top.
}

export interface PopperProps extends PopperPosition {
    children?: ReactNode;
    className?: string;
    open?: boolean;
    resizable?: boolean;
    onClose?: () => void;
    onKeyDown?: (event: React.KeyboardEvent) => void;
    onResize?: (width: number, height: number) => void;
}

export function Popper(props: PopperProps) {
    const {
        className,
        elementRef,
        placement = "bottom-start",
        x,
        y,
        children,
        open,
        offset,
        onClose,
        onKeyDown,
        resizable,
        onResize,
    } = props;

    const initialSizeRef = useRef<{ width: number; height: number } | null>(null);
    const placeRef = useMemo<Element | VirtualElement | undefined>(() => {
        if (elementRef) {
            return elementRef;
        }
        if (x !== undefined && y !== undefined) {
            return {
                getBoundingClientRect: () => ({
                    top: y,
                    left: x,
                    bottom: y,
                    right: x,
                    width: 0,
                    height: 0,
                }),
            } as VirtualElement;
        }
        return undefined;
    }, [elementRef, x, y]);

    const onOpenChange = useCallback(
        (value: boolean) => {
            if (value) {
                onClose?.();
            }
        },
        [onClose]
    );

    const { refs, floatingStyles } = useFloating({
        open,
        onOpenChange,
        placement,
        middleware: offset
            ? [
                  floadingOffset({ mainAxis: offset[1], crossAxis: offset[0] }),
                  flip({
                      fallbackPlacements: [
                          "bottom-start",
                          "bottom-end",
                          "top-start",
                          "top-end",
                      ],
                  }),
              ]
            : [],
        strategy: "fixed",
    });

    useEffect(() => {
        refs.setPositionReference(placeRef ?? null);
    }, [placeRef, refs]);

    useEffect(() => {
        if (refs.floating.current) {
            const { width, height } = refs.floating.current.getBoundingClientRect();
            if (initialSizeRef.current === null) {
                initialSizeRef.current = { width, height };
            }
        }
    }, [refs.floating]);

    const handleClickOutside = useCallback(
        (event: MouseEvent) => {
            if (
                open &&
                refs.floating.current &&
                !refs.floating.current.contains(event.target as Node)
            ) {
                onClose?.();
            }
        },
        [onClose, open, refs.floating]
    );

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    function onPointerDown(event: React.PointerEvent<SVGSVGElement>) {
        if (event.pointerType === "mouse" && event.buttons !== 1) {
            return;
        }

        const currentTarget = refs.floating.current;

        if (!currentTarget) {
            return;
        }

        const { pointerId } = event;
        const { right, bottom } = currentTarget.getBoundingClientRect();
        const offsetX = right - event.clientX;
        const offsetY = bottom - event.clientY;

        function onPointerMove(e: PointerEvent) {
            if (!initialSizeRef.current) {
                return;
            }
            const { width: initialWidth, height: initialHeight } = initialSizeRef.current;
            e.preventDefault();
            const { left, top } = currentTarget!.getBoundingClientRect();
            const width = e.clientX + offsetX - left;
            const height = e.clientY + offsetY - top;
            if (width > 0 && height > 0 && width > initialWidth && height > initialHeight) {
                refs.floating.current?.style.setProperty("width", `${width}px`);
                refs.floating.current?.style.setProperty("height", `${height}px`);
                onResize?.(width, height);
            }
        }

        function onLostPointerCapture() {
            currentTarget!.removeEventListener("pointermove", onPointerMove);
            currentTarget!.removeEventListener(
                "lostpointercapture",
                onLostPointerCapture
            );
        }

        currentTarget!.setPointerCapture(pointerId);
        currentTarget!.addEventListener("pointermove", onPointerMove);
        currentTarget!.addEventListener(
            "lostpointercapture",
            onLostPointerCapture
        );
    }

    if (!open || !placeRef) {
        return null;
    }

    return (
        <PopperRoot
            ref={refs.setFloating}
            className={className}
            style={{ ...floatingStyles, zIndex: 1000 }}
            onKeyDown={onKeyDown}
        >
            {children}
            {resizable && (
                <ResizeHandleIcon
                    className="resize-handle"
                    onPointerDown={onPointerDown}
                />
            )}
        </PopperRoot>
    );
}
