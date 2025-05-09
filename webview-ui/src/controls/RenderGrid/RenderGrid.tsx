import React, { useEffect, useImperativeHandle } from 'react';
import styled from '@emotion/styled';

import RenderGridModel, {
    defaultRenderGridState,
    RenderGridProps,
} from './RenderGridModel';
import { RefType } from './types';
import { useComponentModel } from '../../common/classes/model';
import { whiteSpace } from './renderInfo';

const iFrameStyle: React.CSSProperties = {
    display: 'block',
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: -1,
    border: 'none',
};

const RenderGridRoot = styled.div(
    {
        '.avg-stickyTop': {
            backgroundColor: 'inherit',
        },
        '.avg-stickyLeft': {
            backgroundColor: 'inherit',
        },
        '.avg-stickyTopLeft': {
            backgroundColor: 'inherit',
        },
        '.avg-stickyBottomLeft': {
            backgroundColor: 'inherit',
        },
        '.avg-stickyRight': {
            backgroundColor: 'inherit',
        },
        '.avg-stickyTopRight': {
            backgroundColor: 'inherit',
        },
        '.avg-stickyBottomRight': {
            backgroundColor: 'inherit',
        },
        '.avg-stickyBottom': {
            backgroundColor: 'inherit',
        },
    },
    { label: 'RenderGrid' },
);

const RenderGrid = React.forwardRef<RenderGridModel, RenderGridProps>(function RenderGrid(
    props: RenderGridProps,
    ref: React.ForwardedRef<RenderGridModel>,
) {
    const model = useComponentModel(
        props,
        RenderGridModel,
        defaultRenderGridState,
    );
    model.state.use();

    useEffect(() => {
        window.addEventListener('resize', model.onFrameResize);
        return () => {
            window.removeEventListener('resize', model.onFrameResize);
        };
    }, [model.onFrameResize]);

    useImperativeHandle(ref, () => model);

    const {
        size,
        renderInfo: { current: info },
    } = model;

    model.props.onRender?.();

    return (
        <RenderGridRoot
            id="avg-root"
            ref={model.gridRef.ref as RefType<HTMLDivElement>}
            className={model.props.className}
            style={{
                flex: '1 1 auto',
                position: 'relative',
                overflow: 'hidden',
                height: props.growToHeight ? 'unset' : 100,
                maxHeight: props.growToHeight ?? 'unset',
                ...model.blockStyles?.root,
            }}
            {...(model.props.contentProps || {})}
        >
            <iframe
                title="render-grid-frame"
                style={iFrameStyle}
                src={null as any}
                ref={model.setFrameRef}
                aria-hidden
                tabIndex={-1}
                frameBorder={0}
            />
            <div
                id="avg-container"
                ref={model.containerRef.ref as RefType<HTMLDivElement>}
                style={{
                    width: props.growToWidth ? 'unset' : size.width,
                    height: props.growToHeight ? 'unset' : size.height,
                    maxHeight: props.growToHeight ?? 'unset',
                    maxWidth: props.growToWidth ?? 'unset',
                    overflowY: 'auto',
                    overflowX: model.props.fitToWidth ? 'hidden' : 'auto',
                    ...model.blockStyles?.container,
                }}
                onScroll={model.onScroll}
            >
                <div
                    id="avg-render-area"
                    style={{
                        width: info.innerSize.width,
                        height: info.innerSize.height,
                        position: 'relative',
                        ...model.blockStyles?.renderArea,
                    }}
                    {...(model.props.renderAreaProps || {})}
                >
                    {Boolean(model.props.stickyTop) && (
                        <div
                            id="avg-sticky-top"
                            className="avg-stickyTop"
                            style={{
                                top: 0,
                                width: info.innerSize.width,
                                height: info.innerSize.stickyTopHeight,
                                position: 'sticky',
                                zIndex: 2,
                                ...model.blockStyles?.stickyTop,
                            }}
                        >
                            {Boolean(model.props.stickyLeft) && (
                                <div
                                    id="avg-sticky-top-left"
                                    className="avg-stickyTopLeft"
                                    style={{
                                        display: 'inline-flex',
                                        left: 0,
                                        height: info.innerSize.stickyTopHeight,
                                        width: info.innerSize.stickyLeftWidth,
                                        position: 'sticky',
                                        zIndex: 3,
                                        ...model.blockStyles?.stickyTopLeft,
                                    }}
                                >
                                    {info.stickyTopLeft}
                                </div>
                            )}
                            {Boolean(model.props.stickyRight) && (
                                <div
                                    id="avg-sticky-top-right"
                                    className="avg-stickyTopRight"
                                    style={{
                                        display: 'inline-flex',
                                        left:
                                            (size.width || 0) -
                                            info.innerSize.stickyRightWidth -
                                            model.scrollBarWidth,
                                        height: info.innerSize.stickyTopHeight,
                                        width: info.innerSize.stickyRightWidth,
                                        position: 'sticky',
                                        zIndex: 3,
                                        ...model.blockStyles?.stickyTopRight,
                                    }}
                                >
                                    {info.stickyTopRight}
                                </div>
                            )}
                            {info.stickyTop}
                        </div>
                    )}
                    {Boolean(model.props.stickyBottom) && (
                        <div
                            id="avg-sticky-bottom"
                            className="avg-stickyBottom"
                            style={{
                                top:
                                    (size.height || 0) -
                                    info.innerSize.stickyBottomHeight -
                                    model.scrollBarHeight,
                                width: info.innerSize.width,
                                height: info.innerSize.stickyBottomHeight,
                                position: 'sticky',
                                zIndex: 2,
                                ...model.blockStyles?.stickyBottom,
                            }}
                        >
                            {Boolean(model.props.stickyLeft) && (
                                <div
                                    id="avg-sticky-bottom-left"
                                    className="avg-stickyBottomLeft"
                                    style={{
                                        display: 'inline-flex',
                                        left: 0,
                                        height: info.innerSize
                                            .stickyBottomHeight,
                                        width: info.innerSize.stickyLeftWidth,
                                        position: 'sticky',
                                        zIndex: 3,
                                        ...model.blockStyles?.stickyBottomLeft,
                                    }}
                                >
                                    {info.stickyBottomLeft}
                                </div>
                            )}
                            {Boolean(model.props.stickyRight) && (
                                <div
                                    id="avg-sticky-bottom-right"
                                    className="avg-stickyBottomRight"
                                    style={{
                                        display: 'inline-flex',
                                        left:
                                            (size.width || 0) -
                                            info.innerSize.stickyRightWidth -
                                            model.scrollBarWidth,
                                        height: info.innerSize
                                            .stickyBottomHeight,
                                        width: info.innerSize.stickyRightWidth,
                                        position: 'sticky',
                                        zIndex: 3,
                                        ...model.blockStyles?.stickyBottomRight,
                                    }}
                                >
                                    {info.stickyBottomRight}
                                </div>
                            )}
                            {info.stickyBottom}
                        </div>
                    )}
                    {Boolean(model.props.stickyLeft) && (
                        <div
                            id="avg-sticky-left"
                            className="avg-stickyLeft"
                            style={{
                                display: 'inline-flex',
                                left: 0,
                                width: info.innerSize.stickyLeftWidth,
                                height:
                                    info.innerSize.height -
                                    (info.innerSize.stickyTopHeight +
                                        (info.innerSize.stickyBottomHeight
                                            ? info.innerSize.stickyBottomHeight
                                            : whiteSpace)),
                                zIndex: 1,
                                position: 'sticky',
                                transform: `translate(0, -${info.innerSize.stickyBottomHeight}px)`,
                                ...model.blockStyles?.stickyLeft,
                            }}
                        >
                            {info.stickyLeft}
                        </div>
                    )}
                    {Boolean(model.props.stickyRight) && (
                        <div
                            id="avg-sticky-right"
                            className="avg-stickyRight"
                            style={{
                                display: 'inline-flex',
                                left:
                                    (size.width || 0) -
                                    info.innerSize.stickyRightWidth -
                                    model.scrollBarWidth,
                                width: info.innerSize.stickyRightWidth,
                                height:
                                    info.innerSize.height -
                                    (info.innerSize.stickyTopHeight +
                                        info.innerSize.stickyBottomHeight),
                                zIndex: 1,
                                position: 'sticky',
                                transform: `translate(0, -${info.innerSize.stickyBottomHeight}px)`,
                                ...model.blockStyles?.stickyRight,
                            }}
                        >
                            {info.stickyRight}
                        </div>
                    )}
                    {info.cells}
                    {props.extraElement}
                </div>
            </div>
        </RenderGridRoot>
    );
});

export default React.memo(RenderGrid);
