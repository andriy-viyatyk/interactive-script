import ui from "interactive-script-js";

const text = `
function add(a: number, b: number): number {
    return a + b;
}
`

async function showTextDemo() {
    ui.success("Open text in new window demo.").fontSize(18).print();

    ui.log("");
    ui.text("You can open text in new window.");
    await ui.dialog.buttons(["Show me"]);

    ui.window.showText(text, {
        language: "typescript",
    });

    ui.log("");
    ui.success("End of demo.");
}

showTextDemo().finally(() => {
    process.exit(0);
});