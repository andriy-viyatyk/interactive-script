import ui, { styledText } from "interactive-script-js";

async function confirmDemo() {
    ui.text("Confirm Dialog Demo").color("lightseagreen").fontSize(18).print();

    let pressedButton = await ui.dialog.confirm("Single confirm message with default buttons.");
    ui.log("You pressed: ")
        .then(pressedButton).color("lime")
        .print();

    ui.log("");
    pressedButton = await ui.dialog.confirm({
        title: "Dialog title",
        message: "Dialog with title, message and custom buttons.",
        buttons: ["Custom button 1", "Custom button 2", "Custom button 3"],
    });
    ui.log("You pressed: ")
        .then(pressedButton).color("lime")
        .print();

    ui.log("");
    pressedButton = await ui.dialog.confirm({
        title: styledText("Dialog").color("yellow").then(" title").value,
        message: styledText("Dialog with ").then("styled text").color("lime").then(" in title, message and custom buttons.").value,
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

confirmDemo()
    .catch(e => console.error(e))
    .finally(() => process.exit(0));