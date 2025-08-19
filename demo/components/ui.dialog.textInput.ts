import ui, { styledText } from "interactive-script-js";
import { longText } from "./constants";

async function textInputDemo() {
    ui.success("Text Input Demo").fontSize(18).print();

    ui.log("");
    ui.text("You can show input dialog:");
    let text = await ui.dialog.textInput("Enter some text:");
    ui.log("You entered: ")
        .then(text?.result).color("lightseagreen")
        .then(" and pressed: ")
        .then(text?.resultButton).color("lightblue")
        .then(" button.")
        .print();

    ui.log("");
    ui.text("You can pass buttons and mark one as required using '!' character:");
    text = await ui.dialog.textInput({
        title: "Enter some text:",
        buttons: ["Cancel", "!Ok"],
    });

    ui.log("");
    ui.text("You can provide own buttons and initial text:");
    text = await ui.dialog.textInput({
        title: "Enter some text:",
        buttons: ["OK", "Cancel"],
        result: "Initial text",
    });
    ui.log("You entered: ")
        .then(text?.result).color("lightseagreen")
        .then(" and pressed: ")
        .then(text?.resultButton).color("lightblue")
        .then(" button.")
        .print();

    ui.log("");
    ui.text("You can style the title and buttons:");
    await ui.dialog.textInput({
        title: styledText("Enter some text:").color("lightblue").value,
        buttons: [
            styledText("OK").color("lightgreen").value,
            styledText("Cancel").color("red").value,
        ],
    });

    ui.log("");
    ui.text("Long text will be wrapped by line breaks and scrolled:");
    await ui.dialog.textInput({
        title: "Enter some text:",
        buttons: ["OK"],
        result: longText,
    });

    ui.log("");
    ui.success("End of Demo.");
}

textInputDemo()
    .catch(e => console.error(e))
    .finally(() => process.exit(0));