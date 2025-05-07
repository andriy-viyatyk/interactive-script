import { ReactNode, useCallback, useEffect, useMemo } from 'react';
import {Placement, useFloating, VirtualElement, offset as floadingOffset, flip} from '@floating-ui/react';
import styled from '@emotion/styled';
import color from '../theme/color';

export const PopperRoot = styled.div({
    backgroundColor: color.background.default,
    border: `1px solid ${color.border.default}`,
    borderRadius: 6,
    boxShadow: color.shadow.default,
})

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
    onClose?: () => void;
}

export function Popper(props: PopperProps) {
    const {
        className,
        elementRef,
        placement = 'bottom-start',
        x,
        y,
        children,
        open,
        offset,
        onClose,
    } = props;

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

    const onOpenChange = useCallback((value: boolean) => {
        if (value) {
            onClose?.();
        }
    }, [onClose]);

    // const [popupRef, setPopupRef] = useState<HTMLDivElement | null>(null);
    const { refs, floatingStyles } = useFloating({
        open,
        onOpenChange,
        placement,
        middleware: offset
            ? [
                floadingOffset({mainAxis: offset[1], crossAxis: offset[0]}),
                flip({
                    fallbackPlacements: ["bottom-start", "bottom-end", "top-start", "top-end"],
                  }),
              ]
            : [],
        strategy: "fixed",
    });

    useEffect(() => {
        refs.setPositionReference(placeRef ?? null);
    }, [placeRef, refs]);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (open && refs.floating.current && !refs.floating.current.contains(event.target as Node)) {
            onClose?.();
        }
    }, [onClose, open, refs.floating]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    if (!open || !placeRef) {
        return null;
    }

    return (
        <PopperRoot
            ref={refs.setFloating}
            className={className}
            style={{...floatingStyles, zIndex: 1000}}
        >
            {children}
        </PopperRoot>
    );
}
