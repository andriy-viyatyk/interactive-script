import { useMemo } from "react";
import { GridData } from "../types";
import { MenuItem } from "../../controls/PopupMenu";
import { gridViewModel } from "./GridViewModel";
import { toClipboard } from "../../common/utils/utils";
import { recordsToCsv } from "../../common/utils/csvUtils";
import { recordsToClipboardFormatted } from "../../common/utils/formatedRecords";
import { removeIdColumn } from "../useGridData";

export function useCopyItems(gridData: GridData): MenuItem[] {
    const delimiter = gridViewModel.state.use((s) => s.delimiter);
    return useMemo(
        (): MenuItem[] => [
            {
                label: "Copy as JSON",
                onClick: () => {
                    const rowsToCopy = removeIdColumn(gridData.rows);
                    toClipboard(JSON.stringify(rowsToCopy, null, 4));
                },
            },
            {
                label: "Copy as CSV",
                onClick: () => {
                    toClipboard(
                        recordsToCsv(
                            gridData.rows,
                            gridData.columns.map((c) => c.key.toString()),
                            { delimiter }
                        )
                    );
                },
            },
            {
                label: "Copy formated",
                onClick: () => {
                    recordsToClipboardFormatted(gridData.rows, gridData.columns);
                }
            }
        ],
        [gridData, delimiter]
    );
}
