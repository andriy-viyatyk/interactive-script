import styled from "@emotion/styled";
import { forwardRef, ReactNode } from "react";

const ChipRoot = styled.div({});

interface ChipProps {
    label: ReactNode;
    onDelete?: () => void;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    disabled?: boolean;
    className?: string;
}

export const Chip = forwardRef(function ChipComponent(
    props: ChipProps,
    ref: React.Ref<HTMLDivElement>
) {
    return (
        <ChipRoot ref={ref} onClick={props.onClick} className={props.className}>
            {props.label}
        </ChipRoot>
    );
});
