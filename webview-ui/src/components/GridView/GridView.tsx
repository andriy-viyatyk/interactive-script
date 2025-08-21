import styled from "@emotion/styled";
import clsx from "clsx";

import color from "../../theme/color";
import { getRowKey } from "../useGridData";
import { TextField } from "../../controls/TextField";
import { Button } from "../../controls/Button";
import {
    CloseIcon,
    ColumnsIcon,
    CopyIcon,
    SaveAsIcon,
    SearchIcon,
} from "../../theme/icons";
import AVGrid from "../../controls/AVGrid/AVGrid";
import { GlobalRoot } from "../GlobalRoot";
import { FlexSpace } from "../../controls/FlexSpace";
import { gridViewModel } from "./GridViewModel";
import { showCsvOptions } from "./CsvOptions";
import { useCopyItems } from "./useCopyItems";
import { showPopupMenu } from "../../dialogs/showPopupMenu";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiltersProvider } from "../../controls/AVGrid/filters/useFilters";
import { FilterBar } from "../../controls/AVGrid/filters/FilterBar";
import { AVGridModel } from "../../controls/AVGrid/model/AVGridModel";
import commands from "../../../../shared/commands";
import { showColumnsOptions } from "./ColumnsOptions";
import { useSaveAsItems } from "./useSaveAsItems";

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
        "& .records-count": {
            color: color.text.light,
        },
    },
    "& .hovered-link-cell": {
        textDecoration: "underline",
        cursor: "pointer",
    }
});

export default function GridView() {
    const gridRef = useRef<AVGridModel<any>>(undefined);
    const model = gridViewModel;
    model.gridRef = gridRef.current;
    const state = model.state.use();
    const copyItems = useCopyItems(gridRef);
    const saveAsItems = useSaveAsItems();
    const [, /* unused */ setRefresh] = useState(0);
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        model.updateGridData();

        window.addEventListener("message", model.onWindowMessage);
        model.sendMessage(commands.viewReady());

        return () => {
            window.removeEventListener("message", model.onWindowMessage);
        };
    }, [model]);

    const onVisibleRowsChanged = useCallback(() => {
        Promise.resolve().then(() => {
            setRefresh(new Date().getTime());
        });
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "f" && e.ctrlKey) {
            e.preventDefault();
            if (searchRef.current) {
                searchRef.current.focus();
            }
        }
        if (e.code === "ControlLeft" || e.code === "ControlRight") {
            model.setCtrlPressed(true);
        }
    }, [model]);

    const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
        if (e.code === "ControlLeft" || e.code === "ControlRight") {
            model.setCtrlPressed(false);
        }
    }, [model]);

    const handleBlur = useCallback(() => {
        model.setCtrlPressed(false);
    }, [model]);

    return (
        <FiltersProvider
            filters={state.filters}
            setFilters={model.setFilters}
            onGetOptions={model.onGetOptions}
        >
            <GridViewRoot onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onBlur={handleBlur}>
                <div className="app-header">
                    {!state.isCsv && (
                        <Button
                            size="mini"
                            type="flat"
                            title="Edit Columns"
                            onClick={(e) => {
                                if (gridRef.current) {
                                    showColumnsOptions(
                                        e.currentTarget,
                                        gridRef.current,
                                        model.onUpdateRows
                                    );
                                }
                            }}
                        >
                            <ColumnsIcon />
                        </Button>
                    )}
                    <FlexSpace />
                    <span className="records-count">{model.recordsCount}</span>
                    <TextField
                        ref={searchRef}
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
                    {Boolean(state.isCsv) && (
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
                        title="Copy as..."
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
                    <Button
                        size="small"
                        type="flat"
                        title="Save as..."
                        onClick={(e) => {
                            showPopupMenu(e.clientX, e.clientY, saveAsItems, {
                                elementRef: e.currentTarget,
                                placement: "bottom-end",
                                offset: [0, 2],
                            });
                        }}
                    >
                        <SaveAsIcon />
                    </Button>
                </div>
                <FilterBar className="filter-bar" gridModel={gridRef.current} />
                <AVGrid
                    ref={gridRef}
                    columns={state.columns}
                    rows={state.rows}
                    getRowKey={getRowKey}
                    focus={state.focus}
                    setFocus={model.setFocus}
                    searchString={state.search}
                    filters={state.filters}
                    onVisibleRowsChanged={onVisibleRowsChanged}
                    editRow={model.editRow}
                    onAddRows={model.onAddRows}
                    onDeleteRows={model.onDeleteRows}
                    onDataChanged={model.onDataChanged}
                    onCellClass={model.getCellClass}
                    onClick={model.cellClick}
                />
            </GridViewRoot>
        </FiltersProvider>
    );
}
