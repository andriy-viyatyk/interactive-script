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
        const { focus, getRowKey, onAddRows, onDeleteRows, searchString, filters } = this.model.props;
        const sortColumn = this.model.state.get().sortColumn;

        const canInsertRows = !sortColumn && !searchString?.length && !filters?.length;

        if (focus && (e.target as HTMLElement).tagName !== 'INPUT') {
            e.stopPropagation();
            e.preventDefault();
            const selection = this.model.models.focus.getGridSelection();
            showPopupMenu(e.clientX, e.clientY, [
                {
                    label: 'Copy',
                    onClick: () => this.model.models.copyPaste.copySelection(),
                    icon: <CopyIcon />,
                },
                {
                    label: 'Paste',
                    onClick: () => this.model.models.copyPaste.pasteFromClipboard(),
                    invisible: !this.model.props.editRow,
                    disabled: this.disablePaste(),
                    icon: <PasteIcon />,
                },
                {
                    label: `Insert ${selection?.rows.length} row${(selection?.rows.length ?? 0) > 1 ? 's' : ''}`,
                    onClick: () => this.model.actions.addRows(selection?.rows.length ?? 1, selection?.rowRange[0]),
                    invisible: !onAddRows || !selection?.rows.length,
                    icon: <PlusIcon />,
                    startGroup: true,
                    disabled: !canInsertRows,
                    title: !canInsertRows ? "Cannot insert rows while sorting or filtering is applied" : undefined,
                },
                {
                    label: `Add ${selection?.rows.length} row${(selection?.rows.length ?? 0) > 1 ? 's' : ''}`,
                    onClick: () => this.model.actions.addRows(selection?.rows.length ?? 1),
                    invisible: !onAddRows || !selection?.rows.length,
                    icon: <PlusIcon />,
                },
                {
                    label: `Delete ${selection?.rows.length} row${(selection?.rows.length ?? 0) > 1 ? 's' : ''}`,
                    onClick: () =>
                        this.model.actions.deleteRows(selection?.rows.map(getRowKey) ?? []),
                    invisible: !onDeleteRows || !selection?.rows.length,
                    icon: <DeleteIcon />,
                },
            ]);
        }
    }
}