import ui, { styledText } from 'interactive-script-js';

async function gridInputDemo() {
    ui.success("Grid Input Demo").fontSize(18).print();

    ui.log("");
    ui.text("You can use ui.dialog.gridInput() command to display editable grid where user can add, edit and delete rows.");
    ui.text("User also can paste range of cells into the grid for example from Excel.");

    let result = await ui.dialog.gridInput({
        title: "Grid Input",
        columns: [
            { key: "name", title: "Name", width: 200 },
            { key: "age", title: "Age", width: 100, dataType: "number" },
            { key: "role", title: "Role", width: 150, options: ["Admin", "User", "Guest"] },
            { key: "active", title: "Active", width: 80, dataType: "boolean" }
        ],
        result: [{}], // you can add empty first row here if needed 
    });

    ui.log("Grid Input Result:");
    ui.show.textBlock({
        title: "Grid Input Result",
        text: JSON.stringify(result.result, null, 4)
    });

    ui.log("");
    ui.text("You can also provide initial data or data for edit without posibility ot add or delete rows:");

    result = await ui.dialog.gridInput({
        title: styledText("Grid").color("lightblue").then(" input").value,
        columns: [
            { key: "hiddenId", hidden: true }, // actually this hidden column doesn't needed. Provided id in result will be returned back anyway.
            { key: "name", title: "Name", width: 200, readonly: true },
            { key: "age", title: "Age", width: 100, dataType: "number", readonly: true },
            { key: "role", title: "Role", width: 150, options: ["Admin", "User", "Guest"] },
            { key: "active", title: "Active", width: 80, dataType: "boolean" }
        ],
        result: [
            { hiddenId: 1, name: "John Doe", age: 30, role: "Admin", active: true },
            { hiddenId: 2, name: "Jane Smith", age: 25, role: "User", active: false }
        ],
        editOnly: true, // only edits without adding or deleting rows
        buttons: ["Cancel", "Save"]
    });

    ui.show.textBlock({
        title: "Editing Result",
        text: JSON.stringify(result.result, null, 4)
    });
    ui.log("You pressed: ")
        .then(result.resultButton).color("lightblue")
        .print();

    ui.log("");
    ui.success("End of Demo.");
}

gridInputDemo()
    .catch(e => console.error(e))
    .finally(() => process.exit(0));