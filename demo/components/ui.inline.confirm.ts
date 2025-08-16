import ui, { styledText } from "interactive-script-js";

async function inlineConfirmDemo() {
    ui.text("Inline Confirm Dialog Demo").color("lightseagreen").fontSize(18).print();

    ui.text("In addition to ui.dialog.confirm, here is its compact version.");
    ui.log("");

    let pressedButton = await ui.inline.confirm("Single confirm message with default buttons.");
    ui.log("You pressed: ")
        .then(pressedButton).color("lime")
        .print();

    ui.log("");
    pressedButton = await ui.inline.confirm({
        message: "Dialog with message and custom buttons.",
        buttons: ["Custom button 1", "Custom button 2", "Custom button 3"],
    });
    ui.log("You pressed: ")
        .then(pressedButton).color("lime")
        .print();

    ui.log("");
    pressedButton = await ui.inline.confirm({
        message: styledText("Dialog with ").then("styled text").color("lime").then(" in message and custom buttons.").value,
        buttons: [
            styledText("button ").then("one").color("orange").value,
            styledText("button ").then("two").color("springgreen").value,
            styledText("button ").then("three").color("aqua").value,
        ],
    });
    ui.log("You pressed: ")
        .then(pressedButton).color("lime")
        .print();
}

inlineConfirmDemo()
    .catch(e => console.error(e))
    .finally(() => process.exit(0));
