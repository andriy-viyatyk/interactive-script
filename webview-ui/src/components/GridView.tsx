import styled from "@emotion/styled";
import clsx from "clsx";

import color from "../theme/color";
import { CellFocus } from "../controls/AVGrid/avGridTypes";
import { TComponentModel, useComponentModel } from "../common/classes/model";
import { SetStateAction } from "react";
import { resolveState } from "../common/utils/utils";
import { getRowKey, useWorkingData } from "./useGridData";
import { TextField } from "../controls/TextField";
import { Button } from "../controls/Button";
import { CloseIcon, SearchIcon } from "../theme/icons";
import AVGrid from "../controls/AVGrid/AVGrid";

const GridViewRoot = styled.div({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    backgroundColor: color.vs.background,
    "& .data-cell": {
        userSelect: "none",
    },
    "& .header-cell": {
        userSelect: "none",
    },
    "& .highlighted-text": {
        color: color.olive[6],
    },
    "& .app-header": {
        display: "flex",
        alignItems: "center",
        padding: "4px 8px",
    },
    "& .search-field": {
        "& input": {
            borderColor: color.border.light,
            borderRadius: 0,
            padding: 0,
            paddingLeft: 8,
            height: 24,
            outline: "none",
        },
        "& .search-icon": {
            color: color.icon.light,
            width: 16,
            height: 16,
            margin: 3,
        },
        '& .clear-search-button': {
            padding: 0,
            paddingTop: 1,
        }
    },
    '& .search-field-focus input': {
        borderColor: color.olive[7],
    }
});

const defaultGridViewState = {
    focus: undefined as CellFocus | undefined,
    search: "",
};

type GridViewState = typeof defaultGridViewState;

class GridViewModel extends TComponentModel<GridViewState, null> {
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

export default function GridView() {
    const data = useWorkingData();
    const model = useComponentModel(null, GridViewModel, defaultGridViewState);
    const state = model.state.use();

    return (
        <GridViewRoot>
            <div className="app-header">
                <TextField
                    value={state.search}
                    onChange={model.setSearch}
                    width={300}
                    className={clsx("search-field", {
                        "search-field-focus": state.search,
                    })}
                    endButtons={[
                        ...(state.search
                            ? [
                                  <Button
                                      size="small"
                                      type="icon"
                                      key="clear-search"
                                      onClick={model.clearSearch}
                                      className="clear-search-button"
                                  >
                                      <CloseIcon />
                                  </Button>,
                              ]
                            : []),
                        <SearchIcon
                            key="search-icon"
                            className="search-icon"
                        />,
                    ]}
                />
                <div style={{ flex: "1 1 auto" }} />
            </div>
            <AVGrid
                columns={data.columns}
                rows={data.rows}
                getRowKey={getRowKey}
                focus={state.focus}
                setFocus={model.setFocus}
                searchString={state.search}
            />
        </GridViewRoot>
    );
}
