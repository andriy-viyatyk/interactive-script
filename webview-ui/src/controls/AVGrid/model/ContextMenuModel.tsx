import { showPopupMenu } from "../../../dialogs/showPopupMenu";
import { CopyIcon, DeleteIcon, PasteIcon, PlusIcon } from "../../../theme/icons";
import { getGridSelection } from "../useUtils";
import { AVGridModel } from "./AVGridModel";

export class ContextMenuModel<R> {
    readonly model: AVGridModel<R>;

    constructor(model: AVGridModel<R>) {
        this.model = model;
        this.model.events.content.onContextMenu.subscribe(this.onContentContextMenu);
    }

    private onContentContextMenu = async (e?: React.MouseEvent<HTMLDivElement>) => {
        if (!e) return;
        const { focus, getRowKey, onAddRows, onDeleteRows } = this.model.props;
        const { rows, columns } = this.model.data;

        if (focus && (e.target as HTMLElement).tagName !== 'INPUT') {
            e.stopPropagation();
            e.preventDefault();
            const selection = getGridSelection(focus, rows, columns, getRowKey);
            const canPaste = false; // await canPasteFromClipboard();
            showPopupMenu(e.clientX, e.clientY, [
                {
                    label: 'Copy',
                    onClick: () => this.model.models.copyPaste.copySelection(),
                    icon: <CopyIcon />,
                },
                {
                    label: 'Paste',
                    onClick: () => this.model.models.copyPaste.pasteFromClipboard(),
                    invisible: !canPaste,
                    icon: <PasteIcon />,
                },
                {
                    label: `Insert ${selection?.rows.length} row${(selection?.rows.length ?? 0) > 1 ? 's' : ''}`,
                    onClick: () => onAddRows?.(selection?.rows.length ?? 1, selection?.rowRange[0]),
                    invisible: !onAddRows || !selection?.rows.length,
                    icon: <PlusIcon />,
                    startGroup: true,
                },
                {
                    label: `Add ${selection?.rows.length} row${(selection?.rows.length ?? 0) > 1 ? 's' : ''}`,
                    onClick: () => onAddRows?.(selection?.rows.length ?? 1),
                    invisible: !onAddRows || !selection?.rows.length,
                    icon: <PlusIcon />,
                },
                {
                    label: `Delete ${selection?.rows.length} row${(selection?.rows.length ?? 0) > 1 ? 's' : ''}`,
                    onClick: () =>
                        onDeleteRows?.(
                            selection?.rows.map(getRowKey) ?? [],
                        ),
                    invisible: !onDeleteRows || !selection?.rows.length,
                    icon: <DeleteIcon />,
                },
            ]);
        }
    }
}