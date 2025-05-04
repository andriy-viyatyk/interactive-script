import ui, { styledText } from "interactive-script-js";

function getRow(index: number) {
    return {
        name: `Item ${index}`,
        description: `Description for item ${index}`,
        value: index,
        timestamp: new Date().toISOString(),
        isActive: index % 2 === 0,
        isSelected: index % 3 === 0,
        city: `City ${index}`,
        country: `Country ${index}`,
        address: `Address ${index}`,
        phone: `${index.toString()[0].repeat(3)}-${(index.toString()[1] ?? "0").repeat(3)}-${(index.toString()[2] ?? "0").repeat(4)}`,
    };
}

function getRows(count: number) {
    return Array.from({ length: count }, (_, i) => getRow(i + 1));
}

function gridDemo() {
    ui.text("Grid Demo").color("lightseagreen").fontSize(18).print();

    ui.log("");
    ui.text("You can display a grid using array of objects with: ui.show.gridFromJsonArray(data, options):");
    ui.show.gridFromJsonArray(getRows(10000));

    ui.log("");
    ui.text("You can define title and columns by passing options: ui.show.gridFromJsonArray(data, { title, columns }):");
    ui.show.gridFromJsonArray(getRows(10000), {
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

gridDemo();