import ui from "interactive-script-js";
import { longText } from "./constants";

async function showTextDemo() {
    ui.success("Open text in new window demo.").fontSize(18).print();

    ui.log("");
    ui.text("You can open text in new window.");
    await ui.dialog.buttons(["Show me"]);

    ui.window.showText({
        text: longText,
        language: "plaintext",
    });

    ui.log("");
    ui.success("End of demo.");
}

showTextDemo()
    .catch(e => console.error(e))
    .finally(() => process.exit(0));