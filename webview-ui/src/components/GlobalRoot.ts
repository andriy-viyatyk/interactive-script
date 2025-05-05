import styled from "@emotion/styled";
import color from "../theme/color";

export const GlobalRoot = styled.div({
    "& .data-cell": {
        userSelect: "none",
    },
    "& .header-cell": {
        userSelect: "none",
    },
    "& .highlighted-text": {
        color: color.misc.blue,
    },
});