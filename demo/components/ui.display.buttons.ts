import ui, { styledText } from "interactive-script-js";

async function buttonsDemo() {
    ui.success("Buttons Demo").fontSize(18).print();

    ui.log("");
    ui.text('If you call ui.dialog.buttons([]) without buttons, it will display default one:');
    await ui.dialog.buttons([]);
    ui.text("You can pass array of buttons to display:");
    let pressedButton = await ui.dialog.buttons(["one", "two", "three"]);
    ui.text("You pressed: ").then(pressedButton).color("lightseagreen").print();
    ui.text("You can style buttons text using styledText:");
    pressedButton = await ui.dialog.buttons([
        styledText("button ").then("one").color("orange").value,
        styledText("button ").then("two").color("springgreen").value,
        styledText("button ").then("three").color("aqua").value,
    ]);
    ui.text("You pressed: ").then(pressedButton).color("lightseagreen").print();

    ui.success("\nDemo completed.");
}

buttonsDemo().finally(() => {
    process.exit(0);
});