import { css } from "@emotion/react";
import color from "./color";
import 'react-datepicker/dist/react-datepicker.css';

export const globalStyles = css({
    "& .react-datepicker": {
        backgroundColor: color.background.default,
        color: color.text.light,
        border: "none",
        fontFamily: "inherit",
        fontSize: "inherit",
    },
    "& .react-datepicker__navigation-icon::before": {
        borderColor: color.icon.light,
        borderWidth: "2px 2px 0 0",
    },
    "& .react-datepicker__navigation:hover *::before": {
        borderColor: color.icon.default,
    },
    "& .react-datepicker__current-month": {
        color: color.text.light,
    },
    "& .react-datepicker__header": {
        backgroundColor: color.background.default,
        borderColor: color.border.light,
    },
    "& .react-datepicker__day-name": {
        color: color.text.light,
        lineHeight: "1.1rem",
    },
    "& .react-datepicker__day": {
        color: color.text.light,
        lineHeight: "1.1rem",
    },
    "& .react-datepicker__day--today": {
        color: color.text.default,
    },
    "& .react-datepicker__day--keyboard-selected": {
        backgroundColor: "inherit",
    },
    "& .react-datepicker__day--selected": {
        color: color.text.selection,
        backgroundColor: color.background.selection,
    },
    "& .react-datepicker__day:hover": {
        outline: `1px solid ${color.border.default}`,
        backgroundColor: "inherit",
    },
    "& .react-datepicker__day:not(.react-datepicker__day--selected):hover": {
        outline: `1px solid ${color.border.default}`,
        backgroundColor: "inherit",
    },
    "& .react-datepicker__day--selected:hover": {
        backgroundColor: color.background.selection,
    },
    "& .react-datepicker-popper": {
        zIndex: 2,
    },
    "& .react-datepicker__input-container": {
        "& input": {
            backgroundColor: color.background.default,
            color: color.text.dark,
            border: "1px solid",
            borderColor: color.border.default,
            borderRadius: 4,
            padding: "4px 6px",
            outline: "none",
            boxSizing: "border-box",
            height: 26,
            "&:focus": {
                borderColor: color.border.active,
                outline: "none",
            },
            "&.active": {
                borderColor: color.border.active,
            }
        }
    },
    "& div.react-datepicker-popper[data-placement] .react-datepicker__triangle": {
        color: color.border.default,
        fill: color.border.default,
        stroke: color.border.default,
    },
} as any);