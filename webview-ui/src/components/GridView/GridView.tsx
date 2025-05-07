import styled from "@emotion/styled";
import clsx from "clsx";

import color from "../../theme/color";
import { getRowKey, useWorkingData } from "../useGridData";
import { TextField } from "../../controls/TextField";
import { Button } from "../../controls/Button";
import { CloseIcon, CopyIcon, SearchIcon } from "../../theme/icons";
import AVGrid from "../../controls/AVGrid/AVGrid";
import { GlobalRoot } from "../GlobalRoot";
import { UiTextView } from "../OutputView/UiTextView";
import { FlexSpace } from "../../controls/FlexSpace";
import { gridViewModel } from "./GridViewModel";
import { showCsvOptions } from "./CsvOptions";
import { useCopyItems } from "./useCopyItems";
import { showPopupMenu } from "../../dialogs/showPopupMenu";

const GridViewRoot = styled(GlobalRoot)({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    backgroundColor: color.background.default,
    "& .app-header": {
        display: "flex",
        alignItems: "center",
        columnGap: 8,
        padding: "4px 8px",
        backgroundColor: color.background.dark,
        borderBottom: `1px solid ${color.border.default}`,
        "& .title-text": {
            color: color.text.default,
            marginRight: 8,
        },
        "& .search-field": {
            "& input": {
                borderColor: color.border.default,
                backgroundColor: color.background.dark,
                borderRadius: 4,
                paddingLeft: 4,
                paddingTop: 2,
                height: 24,
                outline: "none",
                "&:focus": {
                    borderColor: color.border.active,
                },
            },
            "& .search-icon": {
                color: color.icon.disabled,
                width: 14,
                height: 14,
                padding: 1,
                marginRight: 4,
            },
            "& .clear-search-button": {
                marginRight: 4,
            },
        },
        "& .search-field-focus input": {
            borderColor: color.misc.blue,
        },
    },
});

export default function GridView() {
    const model = gridViewModel;
    const state = model.state.use();
    const data = useWorkingData(state.withColumns, state.delimiter);
    const copyItems = useCopyItems(data);

    return (
        <GridViewRoot>
            <div className="app-header">
                <UiTextView uiText={data.title} className="title-text" />
                <FlexSpace />
                <TextField
                    value={state.search}
                    onChange={model.setSearch}
                    width={200}
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
                {Boolean(data.isCsv) && (
                    <Button
                        size="mini"
                        type="flat"
                        key="csv-options"
                        className="csv-options-button"
                        title="Csv Options"
                        onClick={(e) => {
                            showCsvOptions(e.currentTarget);
                        }}
                    >
                        csv
                    </Button>
                )}
                <Button
                    size="small"
                    type="flat"
                    title="Copy"
                    onClick={(e) => {
                        showPopupMenu(e.clientX, e.clientY, copyItems, {
                            elementRef: e.currentTarget,
                            placement: "bottom-end",
                            offset: [0, 2],
                        });
                    }}
                >
                    <CopyIcon />
                </Button>
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
