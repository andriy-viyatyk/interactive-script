import { RefObject, useMemo } from "react";
import { MenuItem } from "../../controls/PopupMenu";
import { gridViewModel } from "./GridViewModel";
import { toClipboard } from "../../common/utils/utils";
import { recordsToCsv } from "../../common/utils/csvUtils";
import { recordsToClipboardFormatted } from "../../common/utils/formatedRecords";
import { removeIdColumn } from "../useGridData";
import { TAVGridContext } from "../../controls/AVGrid/avGridTypes";

export function useCopyItems(gridRef: RefObject<TAVGridContext | undefined>): MenuItem[] {
    const delimiter = gridViewModel.state.use((s) => s.delimiter);
    return useMemo(
        (): MenuItem[] => [
            {
                label: "Copy as JSON",
                onClick: () => {
                    const rowsToCopy = removeIdColumn(gridRef.current?.rows ?? []);
                    toClipboard(JSON.stringify(rowsToCopy, null, 4));
                },
            },
            {
                label: "Copy as CSV",
                onClick: () => {
                    toClipboard(
                        recordsToCsv(
                            gridRef.current?.rows ?? [],
                            gridRef.current?.columns.map((c) => c.key.toString()) ?? [],
                            { delimiter }
                        )
                    );
                },
            },
            {
                label: "Copy formated",
                onClick: () => {
                    recordsToClipboardFormatted(gridRef.current?.rows ?? [], gridRef.current?.columns ?? []);
                }
            }
        ],
        [delimiter, gridRef]
    );
}
