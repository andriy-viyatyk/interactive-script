import ui, { styledText } from "interactive-script-js";
import { generateRows } from "./utils";

async function gridDemo() {
    ui.text("Grid Demo").color("lightseagreen").fontSize(18).print();

    ui.log("");
    ui.text("You can display a grid using array of objects with: ui.show.gridFromJsonArray(data, options):");
    ui.show.gridFromJsonArray(generateRows(10000));
    await ui.dialog.buttons(["Next"]);

    ui.log("");
    ui.text("You can define title and columns by passing options: ui.show.gridFromJsonArray({data, title, columns }):");
    ui.show.gridFromJsonArray({
        data: generateRows(10000),
        title: styledText("Grid").color("yellow").then(" title").value,
        columns: [
            { title: "Name", key: "name", width: 200 },
            { title: "City", key: "city" },
            { title: "Phone", key: "phone", width: 400 },
        ],
    });

    ui.log("");
    ui.text("You can open grid in main VSCode window by clicking 'Open in separate window' button in the grid title bar.");
    ui.info("Also you can open any json file in a grid using 'AV' button in the top right corner of the VSCode.");
}

gridDemo()
    .catch(e => console.error(e))
    .finally(() => process.exit(0));