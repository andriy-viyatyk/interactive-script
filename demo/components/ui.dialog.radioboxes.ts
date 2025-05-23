import ui, { styledText } from "interactive-script-js";

const manyOptions = Array.from({ length: 100 }, (_, i) => `Option ${i + 1}`);

async function radioboxesDemo() {
    ui.success("Radioboxes demo").fontSize(18).print();

    ui.log("");
    ui.text("You can display a list of radioboxes using: ui.dialog.radioboxes():");
    let selected = await ui.dialog.radioboxes(["one", "two", "three"]);
    ui.log("You selected: ")
        .then(selected?.result).color("gold")
        .then(" and pressed: ")
        .then(selected?.resultButton).color("gold")
        .then(" button.")
        .print();

    ui.log("");
    ui.text("You can pass buttons and mark one as required using '!' character:");
    selected = await ui.dialog.radioboxes({
        items: ["one", "two", "three"],
        buttons: ["Cancel", "!Ok"],
    });

    ui.log("");
    ui.text("You can also provide a title, buttons and default checked state:");
    selected = await ui.dialog.radioboxes({
        title: "Select items",
        items: ["one", "two", "three"],
        result: "three",
        buttons: ["Cancel", "Ok"],
    });
    ui.log("You selected: ")
        .then(selected?.result).color("gold")
        .then(" and pressed: ")
        .then(selected?.resultButton).color("gold")
        .then(" button.")
        .print();

    ui.log("");
    ui.text("You can style text of elements using styledText() function:");
    selected = await ui.dialog.radioboxes({
        title: styledText("Select ").then("items").color("yellowgreen").value,
        items: [
            styledText("Item 1").color("lime").value,
            styledText("Item 2").color("aqua").value,
            styledText("Item 3").color("lightgreen").value,
        ],
        buttons: [
            "Cancel",
            styledText("Ok").color("yellowgreen").value,
        ],
    });
    ui.log("You selected: ")
        .then(selected?.result).color("gold")
        .then(" and pressed: ")
        .then(selected?.resultButton).color("gold")
        .then(" button.")
        .print();

    ui.log("");
    ui.text("Many options will wrap by lines:");
    await ui.dialog.radioboxes(manyOptions);

    ui.log("");
    ui.text("You can provide bodyStyles to display them for example in a grid:");
    await ui.dialog.radioboxes({
        items: manyOptions,
        bodyStyles: {
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "4px",
            padding: "4px",
        },
    });

    ui.log("");
    ui.success("End of demo.");
}

radioboxesDemo().finally(() => {
    process.exit(0);
});

