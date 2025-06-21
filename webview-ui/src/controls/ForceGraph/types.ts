// Define types for Node and Link to ensure type safety with D3
export interface Node extends d3.SimulationNodeDatum {
    id: string;
}

export interface Link extends d3.SimulationLinkDatum<Node> {
    source: string | Node;
    target: string | Node;
}

export interface GraphData {
    nodes: Node[];
    links: Link[];
}

export type Dimensions = { width: number, height: number }

export function linkIds(link: Link) {
    return {
        source: typeof link.source === 'string' ? link.source : link.source.id,
        target: typeof link.target === 'string' ? link.target : link.target.id,
    }
}