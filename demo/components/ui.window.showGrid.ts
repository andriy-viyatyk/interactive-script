import ui from "interactive-script-js";
import { generateRows } from "./utils";

async function showGridDemo() {
    ui.success("Open grid in new window demo.").fontSize(18).print();

    ui.log("");
    ui.text("You can open json array as grid in new window.");
    await ui.dialog.buttons(["Show me"]);

    ui.window.showGrid({
        data: generateRows(10000),
        title: "Data from your script",
    });

    ui.log("");
    ui.success("End of demo.");
}

showGridDemo()
    .catch(e => console.error(e))
    .finally(() => process.exit(0));