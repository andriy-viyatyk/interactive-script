import { showPopupMenu } from "../../../dialogs/showPopupMenu";
import { CopyIcon, DeleteIcon, PasteIcon, PlusIcon } from "../../../theme/icons";
import { AVGridModel } from "./AVGridModel";

export class ContextMenuModel<R> {
    readonly model: AVGridModel<R>;

    constructor(model: AVGridModel<R>) {
        this.model = model;
        this.model.events.content.onContextMenu.subscribe(this.onContentContextMenu);
    }

    private disablePaste = async () => {
        const canPaste = await this.model.models.copyPaste.canPasteFromClipboard();
        return !canPaste;
    }

    private onContentContextMenu = async (e?: React.MouseEvent<HTMLDivElement>) => {
        if (!e) return;
        const { focus, getRowKey, onAddRows, onDeleteRows } = this.model.props;

        if (this.model.models.editing.isFocusEditing(focus)) {
            // call default context menu and disable blur while it is open
            e.stopPropagation();
            e.preventDefault();
            this.model.models.editing.disableBlur = true;
            await showPopupMenu(e.clientX, e.clientY, []);
            this.model.models.editing.disableBlur = false;
            return;
        }

        const canInsertRows = this.model.models.editing.canInsertRows;

        if (focus && (e.target as HTMLElement).tagName !== 'INPUT') {
            e.stopPropagation();
            e.preventDefault();
            const selection = this.model.models.focus.getGridSelection();
            showPopupMenu(e.clientX, e.clientY, [
                {
                    label: 'Copy',
                    onClick: () => this.model.models.copyPaste.copySelection(),
                    icon: <CopyIcon />,
                    title: "Ctrl+C",
                },
                {
                    label: 'Paste',
                    onClick: () => this.model.models.copyPaste.pasteFromClipboard(),
                    invisible: !this.model.props.editRow,
                    disabled: this.disablePaste(),
                    icon: <PasteIcon />,
                    title: "Ctrl+V",
                },
                {
                    label: `Insert ${selection?.rows.length} ${this.model.props.entity ?? "row"}${(selection?.rows.length ?? 0) > 1 ? 's' : ''}`,
                    onClick: () => this.model.actions.addRows(selection?.rows.length ?? 1, selection?.rowRange[0], false),
                    invisible: !onAddRows || !selection?.rows.length,
                    icon: <PlusIcon />,
                    startGroup: true,
                    disabled: !canInsertRows,
                    title: !canInsertRows ? `Cannot insert ${this.model.props.entity ?? "row"}s while sorting or filtering is applied` : "Ctrl+Insert",
                },
                {
                    label: `Add ${selection?.rows.length} ${this.model.props.entity ?? "row"}${(selection?.rows.length ?? 0) > 1 ? 's' : ''}`,
                    onClick: () => this.model.actions.addRows(selection?.rows.length ?? 1, undefined, true),
                    invisible: !onAddRows || !selection?.rows.length,
                    icon: <PlusIcon />,
                },
                {
                    label: `Delete ${selection?.rows.length} ${this.model.props.entity ?? "row"}${(selection?.rows.length ?? 0) > 1 ? 's' : ''}`,
                    onClick: () =>
                        this.model.actions.deleteRows(selection?.rows.map(getRowKey) ?? []),
                    invisible: !onDeleteRows || !selection?.rows.length,
                    icon: <DeleteIcon />,
                    title: "Ctrl+Delete",
                },
            ]);
        }
    }
}