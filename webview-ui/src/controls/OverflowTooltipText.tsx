import styled from '@emotion/styled';
import clsx from 'clsx';
import React from 'react';
import { HTMLAttributes, ReactNode, useState } from 'react';

const OverflowTooltipTextRoot = styled.span(
    {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'inline-block',
        whiteSpace: 'nowrap',
    },
    { name: 'OverflowTooltipText' },
);

function getTextFromReactChildren(children: ReactNode): string {
    if (typeof children === 'string' || typeof children === 'number') {
        return String(children);
    }

    if (Array.isArray(children)) {
        return children.map(getTextFromReactChildren).join('');
    }

    if (React.isValidElement(children) && children.props && (children.props as any).children) {
        return getTextFromReactChildren((children.props as any).children);
    }

    return '';
}

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
            title={overflow ? getTextFromReactChildren(children) : undefined}
            {...rest}
        >
            {children}
        </OverflowTooltipTextRoot>
    );
}
