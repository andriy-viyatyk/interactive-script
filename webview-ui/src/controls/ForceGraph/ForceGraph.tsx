import { useEffect } from "react";
import styled from "@emotion/styled";
import { GraphData } from "./types";
import { defaultForceGraphState, ForceGraphModel } from "./ForceGraphModel";
import color from "../../theme/color";
import { useComponentModel } from "../../common/classes/model";

const ForceGraphRoot = styled.canvas({
    width: "100%",
    height: "100%",
    backgroundColor: color.graph.svg.background,
});

interface ForceGraphProps {
    graphData: GraphData;
}

export function ForceGraph(props: ForceGraphProps) {
    const model = useComponentModel(props, ForceGraphModel, defaultForceGraphState)

    useEffect(() => {
        window.addEventListener("resize", model.handleResize);

        return () => {
            window.removeEventListener("resize", model.handleResize);
            model.simulation?.stop();
        };
    }, [model]);

    useEffect(() => {
        model.handleResize();
        model.updateData();
    }, [model, props.graphData]);

    return (
        <ForceGraphRoot
            ref={model.setCanvasRef}
            className="force-graph"
            onClick={model.onCanvasClick}
            onMouseMove={model.onCanvasMouseMove}
        />
    );
}
