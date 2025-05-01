import styled from '@emotion/styled';
import clsx from 'clsx';
import { HTMLAttributes, useState } from 'react';

const OverflowTooltipTextRoot = styled.span(
    {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'inline-block',
        whiteSpace: 'nowrap',
    },
    { name: 'OverflowTooltipText' },
);

export function OverflowTooltipText(props: HTMLAttributes<HTMLSpanElement>) {
    const { className, children, ...rest } = props;
    const [overflow, setOverflow] = useState(false);

    return (
        <OverflowTooltipTextRoot
            className={clsx('overflow-tooltip-text', className)}
            onMouseOver={(e) => {
                if (e.currentTarget.offsetWidth < e.currentTarget.scrollWidth) {
                    setOverflow(true);
                }
            }}
            onMouseOut={() => setOverflow(false)}
            title={overflow ? children?.toString() : undefined}
            {...rest}
        >
            {children}
        </OverflowTooltipTextRoot>
    );
}
