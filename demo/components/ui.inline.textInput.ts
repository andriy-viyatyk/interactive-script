import ui, { styledText } from "interactive-script-js";
import { longText } from "./constants";

async function inlineTextInputDemo() {
    ui.success("Inline Text Input Demo").fontSize(18).print();

    ui.log("");
    ui.text("Alternatively to ui.dialog.textInput you can use ui.inline.textInput to show input dialog inline:");
    let text = await ui.inline.textInput("Enter some text:");
    ui.log("You entered: ")
        .then(text?.result).color("lightseagreen")
        .then(" and pressed: ")
        .then(text?.resultButton).color("lightblue")
        .then(" button.")
        .print();

    ui.log("");
    ui.text("You can pass buttons and mark one as required using '!' character:");
    text = await ui.inline.textInput({
        title: "Enter some text:",
        buttons: ["Cancel", "!Ok"],
    });

    ui.log("");
    ui.text("You can provide own buttons and initial text:");
    text = await ui.inline.textInput({
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
    await ui.inline.textInput({
        title: styledText("Enter some text:").color("lightblue").value,
        buttons: [
            styledText("OK").color("lightgreen").value,
            styledText("Cancel").color("red").value,
        ],
    });

    ui.log("");
    ui.text("In comparison to ui.dialog.textInput, ui.inline.textInput does not allow line breaks.");

    ui.log("");
    ui.success("End of Demo.");
}

inlineTextInputDemo()
    .catch(e => console.error(e))
    .finally(() => process.exit(0));