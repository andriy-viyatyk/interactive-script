import ui, { styledText } from "interactive-script-js";

const someRecords = [
    { id: 1, name: "John Doe", age: 30 },
    { id: 2, name: "Jane Smith", age: 25 },
    { id: 3, name: "Alice Johnson", age: 28 },
];

async function selectRecordDemo() {
    ui.success("Select Record Demo").fontSize(18).print();

    ui.log("");
    ui.text("You can use ui.dialog.selectRecord to select a record from json array.");
    let response = await ui.dialog.selectRecord(someRecords);
    ui.show.textBlock({
        title: "Selected Record",
        text: JSON.stringify(response?.result, null, 4),
    });

    ui.text("You can provide additional options like multiple selection, title, and buttons.");
    response = await ui.dialog.selectRecord({
        records: someRecords,
        multiple: true,
        title: styledText("Select Multiple Records").color("pink").value,
        buttons: ["Cancel", styledText("OK").color("gold").value],
    });
    ui.log("You have pressed: ")
        .then(response?.resultButton).color("lime")
        .then(" button.")
        .print();
    ui.show.textBlock({
        title: "Selected Records",
        text: JSON.stringify(response?.result, null, 4),
    });

    ui.log("");
    ui.success("End of demo.");
}

selectRecordDemo().finally(() => {
    process.exit(0);
});