import ui, { styledText } from "interactive-script-js";

const manyButtons = Array.from({ length: 100 }, (_, i) => `Button ${i + 1}`);

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

    ui.log("");
    ui.text("Many buttons will wrap by lines:");
    await ui.dialog.buttons(manyButtons);

    ui.log("");
    ui.text("You can provide bodyStyles to display them for example in a grid:");
    await ui.dialog.buttons({
        buttons: manyButtons,
        bodyStyles: {
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "4px",
            padding: "4px",
        },
    });

    ui.success("\nDemo completed.");
}

buttonsDemo().finally(() => {
    process.exit(0);
});