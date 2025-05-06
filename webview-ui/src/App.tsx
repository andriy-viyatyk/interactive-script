import GridView from "./components/GridView";
import { OutputView } from "./components/OutputView/OutputView";

export default function App() {
    if (window.appInput?.viewType === "grid") {
        return <GridView />;
    }

    if (window.appInput?.viewType === "output") {
        return <OutputView />;
    }

    return <div>Unknown Panel Type</div>;
}
