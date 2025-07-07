import styled from "@emotion/styled";
import { GlobalRoot } from "../GlobalRoot";
import color from "../../theme/color";
import { graphViewModel } from "./GraphViewModel";
import { useEffect } from "react";
import { UiTextView } from "../OutputView/UiTextView";
import { ForceGraph } from "../../controls/ForceGraph/ForceGraph";

const GraphViewRoot = styled(GlobalRoot)({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    backgroundColor: color.background.default,
    "& .graph-header": {
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
    },
    "& .graph-container": {
        flex: "1 1 auto",
        position: "relative",
        overflow: "hidden",
    },
});

export default function GraphView() {
    const model = graphViewModel;
    const state = model.state.use();

    useEffect(() => {
        model.loadData();
    }, [model]);

    return (
        <GraphViewRoot>
            <div className="graph-header">
                <UiTextView uiText={state.title} className="title-text" />
            </div>
            <div className="graph-container">
                <ForceGraph graphData={state.graphData} />
            </div>
        </GraphViewRoot>
    );
}
