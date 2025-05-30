import styled from "@emotion/styled";
import color from "../../../theme/color";

export const OutputDialog = styled.div<{active?: boolean}>(props => ({
    margin: "4px 0",
    border: `1px solid ${props.active ? color.border.active : color.border.default}`,
    borderRadius: 4,
    maxHeight: 400,
    "&.inline": {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        padding: "0 4px",
        columnGap: 8,
        border: "none",
        margin: 0,
        marginTop: 2,
    }
}));
