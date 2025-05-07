import ReactDOM from 'react-dom';
import { useMemo } from 'react';

import { DefaultView, ViewPropsRO, Views } from '../common/classes/view';
import { MenuItem, PopupMenu } from '../controls/PopupMenu';
import { TPopperModel } from './types';
import { TComponentState } from '../common/classes/state';
import { showPopper } from './Poppers';
import { CopyIcon } from '../theme/icons';
import { VirtualElement } from '@floating-ui/react';
import { PopperProps } from '../controls/Popper';

const defaultPopupMenuState = {
    x: 0,
    y: 0,
    items: [] as MenuItem[],
    poperProps: undefined as PopperProps | undefined,
};

type PopupMenuState = typeof defaultPopupMenuState;

class PopupMenuModel extends TPopperModel<PopupMenuState, void> {
    addDefaultMenus = async () => {
        const selText = window.getSelection()?.toString();
        const activeElement = document.activeElement;
        const isInputOrTextareaFocused =
            activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement;
        const clipboardText = isInputOrTextareaFocused
            ? await navigator.clipboard.readText()
            : '';

        this.state.update((s) => {
            s.items.push(
                {
                    label: 'Copy',
                    onClick: () => {
                        navigator.clipboard.writeText(selText ?? '');
                    },
                    invisible: !selText,
                    icon: <CopyIcon />,
                    startGroup: true,
                },
                {
                    label: 'Paste',
                    onClick: () => {
                        if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
                            activeElement.focus();
                            document.execCommand('paste');
                        }
                    },
                    icon: <CopyIcon />,
                    invisible: !clipboardText,
                },
            );
        });
    };
}

const defaultOffset = [8, 0] as [number, number];
const showPopupMenuId = Symbol('ShowPopupMenu');

function ShowPopupMenu({ model }: ViewPropsRO<PopupMenuModel>) {
    const { items, x, y, poperProps } = model.state.use();
    const el = useMemo<VirtualElement | Element>(() => {
        const res: VirtualElement = {
            getBoundingClientRect() {
                return {
                    x,
                    y,
                    top: y,
                    left: x,
                    bottom: y,
                    right: x,
                    width: 0,
                    height: 0,
                };
            },
        };
        return res;
    }, [x, y]);

    return ReactDOM.createPortal(
        <PopupMenu
            open
            items={items}
            elementRef={el}
            onClose={() => model.close()}
            offset={defaultOffset}
            {...poperProps}
        />,
        document.body,
    );
}

Views.registerView(showPopupMenuId, ShowPopupMenu as DefaultView);

export const showPopupMenu = async (x: number, y: number, items: MenuItem[], poperProps?: PopperProps) => {
    const state = new TComponentState(defaultPopupMenuState);
    state.update((s) => {
        s.x = x;
        s.y = y;
        s.items = items;
        s.poperProps = poperProps;
    });
    const model = new PopupMenuModel(state);
    await model.addDefaultMenus();
    await showPopper<void>({
        viewId: showPopupMenuId,
        model,
    });
};
