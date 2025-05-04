import ui, { styledText } from "interactive-script-js";
import { longText } from "./constants";

function textBlockDemo() {
    ui.success("TextBlock Demo").fontSize(18).print();

    ui.log("");
    ui.text("You can show large text in a block that have options to copy and open in a new window.");
    ui.show.textBlock(longText);

    ui.log("");
    ui.text("You can also add styled title");
    ui.show.textBlock({
        text: "This is text block with styled title.",
        title: styledText("Styled Title").color("yellow").value,
    });

    ui.log("");
    ui.success("End of Demo.");
}

textBlockDemo();