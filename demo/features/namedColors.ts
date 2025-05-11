import ui, { namedColors } from "interactive-script-js";

// Pick the color
namedColors.forEach((color) => {
    ui.text("         ").background(color)
        .then(" - ")
        .then(color).color(color)
        .then(`  (${color})`)
        .print();
});