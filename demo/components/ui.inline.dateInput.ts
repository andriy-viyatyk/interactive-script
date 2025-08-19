import ui, {styledText} from "interactive-script-js";

async function inlineDateInputDemo() {
    ui.success("ui.inline.dateInput demo").fontSize(18).print();

    ui.text("\nYou can use inline.dateInput to get a date input from the user.");
    let data = await ui.inline.dateInput();
    ui.log("You entered: ")
        .then(data.result.toISOString()).color("lightblue")
        .then(" and pressed: ")
        .then(data.resultButton).color("lightblue")
        .then(" button.")
        .print();

    ui.log("\nYou can also provide title, initial date, and buttons.");
    data = await ui.inline.dateInput({
        title: "Select a date",
        result: new Date("2020-01-01"),
        buttons: ["Cancel", "!OK"],
    });
    ui.log("You entered: ")
        .then(data.result?.toISOString()).color("lightblue")
        .then(" and pressed: ")
        .then(data.resultButton).color("lightblue")
        .then(" button.")
        .print();

    ui.log("\nAnd you can style title and buttons");
    await ui.inline.dateInput({
        title: styledText("Styled title").color("lightseagreen").value,
        buttons: [
            styledText("OK").color("lightpink").value,
        ]
    })

    ui.log("\nEnd of demo.");
}

inlineDateInputDemo()
    .catch(e => console.error(e))
    .finally(() => process.exit(0));
