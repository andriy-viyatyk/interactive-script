import styled from "@emotion/styled";
import { Popper } from "../../controls/Popper";
import { gridViewModel } from "./GridViewModel";
import color from "../../theme/color";
import {
    CheckedIcon,
    RadioCheckedIcon,
    RadioUncheckedIcon,
    UncheckedIcon,
} from "../../theme/icons";
import { Button } from "../../controls/Button";
import ReactDOM from "react-dom";
import { TPopperModel } from "../../dialogs/types";
import { DefaultView, ViewPropsRO, Views } from "../../common/classes/view";
import { useCallback, useEffect, useState } from "react";
import { TComponentState } from "../../common/classes/state";
import { showPopper } from "../../dialogs/Poppers";
import { TextField } from "../../controls/TextField";

const CsvOptionsRoot = styled.div({
    minWidth: 140,
    minHeight: 60,
    border: `1px solid ${color.border.default}`,
    borderRadius: 4,
    backgroundColor: color.background.default,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    rowGap: 8,
    color: color.text.default,
    padding: 16,
    "& .delimiter-text": {
        color: color.text.light,
        marginTop: 8,
    },
    "& .delimiter-other": {
        display: "flex",
        alignItems: "center",
        columnGap: 8,
    },
});

class CsvOptionsModel extends TPopperModel<null, void> {
    el = undefined as Element | undefined;
}

const defaultOffset = [0, 2] as [number, number];
const showCsvOptionsId = Symbol("ShowCsvOptions");

const delimiters = [",", ";", "\t"];

export function CsvOptions({ model }: ViewPropsRO<CsvOptionsModel>) {
    const gridViewState = gridViewModel.state.use();
    const [other, setOther] = useState<string>(gridViewState.delimiter);

    const setOtherProxy = useCallback((value: string) => {
        const valueToSet = value.length > 1 ? value[0] : value;
        setOther(valueToSet);
        if (valueToSet) {
            gridViewModel.setDelimiter(valueToSet);
        }
    }, []);

    useEffect(() => {
        setOther((old) => {
            if (
                old &&
                gridViewState.delimiter &&
                old !== gridViewState.delimiter
            ) {
                return gridViewState.delimiter;
            }
            return old;
        });
    }, [gridViewState.delimiter]);

    return ReactDOM.createPortal(
        <Popper
            elementRef={model.el}
            offset={defaultOffset}
            open
            onClose={model.close}
            placement="bottom-end"
        >
            <CsvOptionsRoot className="csv-options-root">
                <Button
                    size="small"
                    type="icon"
                    onClick={gridViewModel.toggleWithColumns}
                >
                    {gridViewState.withColumns ? (
                        <CheckedIcon />
                    ) : (
                        <UncheckedIcon />
                    )}
                    First row is header
                </Button>
                <div className="delimiter-text">Delimiter:</div>
                {delimiters.map((delimiter) => (
                    <Button
                        key={delimiter}
                        size="small"
                        type="icon"
                        onClick={() => gridViewModel.setDelimiter(delimiter)}
                    >
                        {gridViewState.delimiter === delimiter ? (
                            <RadioCheckedIcon />
                        ) : (
                            <RadioUncheckedIcon />
                        )}
                        {delimiter === "\t" ? "\\t" : delimiter}
                    </Button>
                ))}
                <div className="delimiter-other">
                    Other:
                    <TextField
                        value={other}
                        onChange={setOtherProxy}
                        width={40}
                        className="csv-options-text-field"
                    />
                </div>
            </CsvOptionsRoot>
        </Popper>,
        document.body
    );
}

Views.registerView(showCsvOptionsId, CsvOptions as DefaultView);

export const showCsvOptions = async (el: Element) => {
    const model = new CsvOptionsModel(new TComponentState(null));
    model.el = el;
    await showPopper<void>({
        viewId: showCsvOptionsId,
        model,
    });
};
