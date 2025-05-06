import { SetStateAction } from "react";
import { TModel } from "../../common/classes/model";
import { CellFocus } from "../../controls/AVGrid/avGridTypes";
import { resolveState } from "../../common/utils/utils";
import { TGlobalState } from "../../common/classes/state";

const defaultGridViewState = {
    focus: undefined as CellFocus | undefined,
    search: "",
};

type GridViewState = typeof defaultGridViewState;

class GridViewModel extends TModel<GridViewState> {
    setFocus = (focus?: SetStateAction<CellFocus | undefined>) => {
        this.state.update((s) => {
            s.focus = focus ? resolveState(focus, () => s.focus) : undefined;
        });
    };

    setSearch = (search: string) => {
        this.state.update((s) => {
            s.search = search;
        });
    };

    clearSearch = () => {
        this.state.update((s) => {
            s.search = "";
        });
    };
}

export const gridViewModel = new GridViewModel(new TGlobalState(defaultGridViewState));