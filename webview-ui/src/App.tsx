import GridView from "./components/GridView";
import { OutputView } from "./components/OutputView/OutputView";

export default function App() {
    const wnd = window as any;

    if (wnd.webViewType === "grid") {
        return <GridView />;
    }

    if (wnd.webViewType === "output") {
        return <OutputView />;
    }

    return <div>Unknown Panel Type</div>;
}
