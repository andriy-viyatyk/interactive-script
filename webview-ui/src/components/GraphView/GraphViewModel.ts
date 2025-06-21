import { UiText } from "../../../../shared/ViewMessage";
import { TModel } from "../../common/classes/model";
import { TGlobalState } from "../../common/classes/state";
import { getGraphData } from "../useGraphData";
import { GraphData } from "../../controls/ForceGraph/types";

const defaultGraphViewModelState = {
    graphData: {nodes: [], links: []} as GraphData,
    title: "" as UiText,
};

export type GraphViewModelState = typeof defaultGraphViewModelState;
export class GraphViewModel extends TModel<GraphViewModelState> {
    loadData = () => {
        const { data, title } = getGraphData();
        this.state.update((s) => {
            s.graphData = data || {nodes: [], links: []};
            s.title = title || "";
        });
    }
}

export const graphViewModel = new GraphViewModel(new TGlobalState(defaultGraphViewModelState));