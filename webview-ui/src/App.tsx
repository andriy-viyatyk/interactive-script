import { isGraphData } from "./components/useGraphData";
import AsyncComponent from "./controls/AsyncComponent";

export default function App() {
    if (
        window.appInput?.viewType === "graph" ||
        (window.appInput?.viewType === "json" &&
            isGraphData(window.appInput?.gridInput?.jsonData))
    ) {
        return (
            <AsyncComponent
                component={async () => {
                    const mod = await import(
                        "./components/GraphView/GraphView"
                    );
                    return mod.default;
                }}
            />
        );
    }

    if (
        window.appInput?.viewType === "grid" ||
        window.appInput?.viewType === "json"
    ) {
        return (
            <AsyncComponent
                component={async () => {
                    const mod = await import("./components/GridView/GridView");
                    return mod.default;
                }}
            />
        );
    }

    if (window.appInput?.viewType === "output") {
        return (
            <AsyncComponent
                component={async () => {
                    const mod = await import(
                        "./components/OutputView/OutputView"
                    );
                    return mod.default;
                }}
            />
        );
    }

    return <div>Unknown Panel Type</div>;
}
