import { useMemo } from "react";
import { MenuItem } from "../../controls/PopupMenu";
import { gridViewModel } from "./GridViewModel";

export function useSaveAsItems(): MenuItem[] {
    return useMemo(() => [
        {
            label: "Save as JSON",
            onClick: () => {
                gridViewModel.saveAsJson();
            }
        },
        {
            label: "Save as CSV",
            onClick: () => {
                gridViewModel.saveAsCsv();
            }
        }
    ], [])
}