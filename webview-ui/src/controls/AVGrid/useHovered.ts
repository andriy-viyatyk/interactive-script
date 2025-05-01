import { useEffect, useRef, useState } from "react";
import { RerenderInfo } from "../RenderGrid/types";

export interface useHoveredProps {
    update: (rerender?: RerenderInfo) => void;
}

export function useHovered(props: useHoveredProps){
    const { update } = props;
    const [hovered, setHovered] = useState<number>(-1);
    const oldRef = useRef<number>(-1);

    useEffect(() => {
        if (oldRef.current !== hovered) {
            if (oldRef.current >= 0) update({ rows: [oldRef.current + 1] });
            if (hovered >= 0) update({ rows: [hovered + 1] });
            oldRef.current = hovered;
        }
    }, [hovered, update])

    return {hovered, setHovered }
}