import ui from 'interactive-script-js';
import { generateRows } from './utils';

async function inlineSelectDemo() {
    ui.success("Inline Select Demo").fontSize(18).print();

    ui.log("");
    ui.text("You can use ui.inlineSelect to select a value from a list of simple options.");
    const response = await ui.inline.select({
        label: "Select an option",
        options: ["Option 1", "Option 2", "Option 3"],
    });
    ui.log(`You selected: ${response?.result}`).color("lightcoral").print();

    ui.log("");
    ui.text("You can also use ui.inlineSelect with objects, specifying a label key.");
    const response2 = await ui.inline.select({
        label: "Select an object",
        options: generateRows(1000).map(item => ({
            ...item,
            label: `${item.name} (${item.city}, ${item.country})`,
        })),
        labelKey: "label",
    });
    ui.log(`You selected: ${response2?.result.label}`).color("lightcoral").print();

    ui.log("");
    ui.text("You can also provide your buttons. Also start button with '!' to make selection required to click it.");
    const response3 = await ui.inline.select({
        label: "Select an option with buttons",
        options: ["Button 1", "Button 2", "Button 3"],
        buttons: ["Cancel", "!Select"],
    });
    ui.log(`You selected: ${response3?.result}`).color("lightcoral")
        .then(" and pressed ")
        .then(response3?.resultButton).color("lightseagreen")
        .then(" button")
        .print();

    ui.log("");
    ui.success("End of demo.");
}

inlineSelectDemo().finally(() => {
    process.exit(0);
});