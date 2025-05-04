import ui, { styledText } from "interactive-script-js";

const manyOptions = Array.from({ length: 100 }, (_, i) => `Option ${i + 1}`);

async function checkboxesDemo() {
    ui.success("Checkboxes demo").fontSize(18).print();
    ui.log("");
    ui.text("You can display a list of checkboxes using: ui.dialog.checkboxes(data):");
    let response = await ui.dialog.checkboxes([
        "Item 1",
        "Item 2",
        "Item 3",
    ]);
    ui.log(`You selected: ${response?.result?.join(", ")}`);
    ui.text("Without buttons provided it displays a default button 'Proceed'.");

    ui.log("");
    ui.text("You can also provide a title and buttons and default checked state:");
    response = await ui.dialog.checkboxes({
        title: "Select items",
        items: [
            { label: "Item 1", checked: true },
            { label: "Item 2" },
            { label: "Item 3" },
        ],
        buttons: ["Cancel", "Ok"],
    });
    ui.log(`You selected: ${response?.result?.join(", ")}`);
    ui.log('You pressed: "' + response?.resultButton + '" button.');

    ui.log("");
    ui.text("You can style text of elements using styledText() function:");
    response = await ui.dialog.checkboxes({
        title: styledText("Select ").then("items").color("yellowgreen").value,
        items: [
            { label: styledText("Item 1").color("lime").value },
            { label: styledText("Item 2").color("aqua").value },
            { label: styledText("Item 3").color("lightgreen").value },
        ],
        buttons: [
            "Cancel", 
            styledText("Ok").color("yellowgreen").value,
        ],
    });
    ui.log(`You selected: ${response?.result?.join(", ")}`);
    ui.log('You pressed: "' + response?.resultButton + '" button.');

    ui.log("");
    ui.text("Many options will wrap by lines:");
    await ui.dialog.checkboxes(manyOptions);

    ui.log("");
    ui.text("You can provide bodyStyles to display them for example in a grid:");
    await ui.dialog.checkboxes({
        items: manyOptions.map((item) => ({ label: item })),
        bodyStyles: {
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "4px",
            padding: "4px",
        },
    });

    ui.log("");
    ui.success("End of demo.")
}

checkboxesDemo().then(() => {
    process.exit(0);
});