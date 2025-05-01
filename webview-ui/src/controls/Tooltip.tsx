import ReactDOM from 'react-dom';
import { Tooltip as ReactTooltip, ITooltip } from 'react-tooltip';
import styled from '@emotion/styled';

import color from '../theme/color';

const TooltipRoot = styled(ReactTooltip)({
    backgroundColor: `${color.background.light} !important`,
    color: `${color.text.dark} !important`,
    zIndex: 1000,
    borderRadius: '6px !important',
    fontSize: '13px !important',
});

export function Tooltip(props: Readonly<ITooltip>) {
    const { className, delayShow = 600, ...otherProps } = props;
    return ReactDOM.createPortal(
        <TooltipRoot
            className={className}
            delayShow={delayShow}
            {...otherProps}
        />,
        document.body,
    );
}
