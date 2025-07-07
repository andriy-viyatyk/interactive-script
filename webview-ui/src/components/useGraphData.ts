export function isGraphData(data: any) {
    if (!data || typeof data !== "object") {
        return false;
    }
    if (!Array.isArray(data.nodes) || !Array.isArray(data.links)) {
        return false;
    }

    return (
        (data.nodes as Array<any>).length === 0 ||
        (data.nodes as Array<any>)
            .slice(0, 10)
            .every((node) => node.id && typeof node.id === "string")
    ) && (
        (data.links as Array<any>).length === 0 ||
        (data.links as Array<any>)
            .slice(0, 10)
            .every(
                (link) =>
                    link.source &&
                    typeof link.source === "string" &&
                    link.target &&
                    typeof link.target === "string"
            )
    );
}

export function getGraphData(){
    let data = window.appInput?.graphInput?.jsonData;
    let title = window.appInput?.graphInput?.graphTitle;
    if (isGraphData(data)) {
        return { data, title };
    } else {
        data = window.appInput?.gridInput?.jsonData;
        title = window.appInput?.gridInput?.gridTitle;
        if (isGraphData(data)) {
            return { data, title };
        }
    }
    return { data: { nodes: [], links: [] }, title: "" };
}