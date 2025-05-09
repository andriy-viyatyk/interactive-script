import ui from "interactive-script-js";

const longText = "In a quiet valley nestled between tall mountains and peaceful rivers, there was a village that thrived for many generations. The villagers lived simple yet fulfilling lives, working the land, raising animals, and crafting tools that were known across nearby regions. Among them was a young villager who dreamed of adventure and exploration. This young villager often gazed at the horizon, wondering what lay beyond the mountains and rivers.";
const someJsonForGrid = [
    { name: "Item 1", description: "Description for item 1", value: 1 },
    { name: "Item 2", description: "Description for item 2", value: 2 },
    { name: "Item 3", description: "Description for item 3", value: 3 },
    { name: "Item 4", description: "Description for item 4", value: 4 },
    { name: "Item 5", description: "Description for item 5", value: 5 },
    { name: "Item 6", description: "Description for item 6", value: 6 },
    { name: "Item 7", description: "Description for item 7", value: 7 },
    { name: "Item 8", description: "Description for item 8", value: 8 },
    { name: "Item 9", description: "Description for item 9", value: 9 },
];

async function demoMain() {
    ui.clear();
    ui.log([{text: "Interactive Script Demo", styles: {fontSize: 18, color: 'cyan'}}]);
    ui.log("After importing ui from 'interactive-script-js:'");
    ui.log('import ui from "interactive-script-js";').border("silver").style({padding: 8}).print();
    ui.log("what you can do running it using 'Interactive Script' extension in VSCode:");
    ui.log("");

    // Output

    ui.log([{text: "Output:", styles: {color: 'lime'}}]);
    ui.log("")
    ui.log("You can print text as you do with console.log by executing: ui.log('text')");
    console.log("You can use console.log as well.");
    ui.error("Print error message using: ui.error('text')");
    ui.warn("Print warning message using: ui.warn('text')");
    ui.info("Print info message using: ui.info('text')");
    ui.success("Print success message using: ui.success('text')");
    ui.log([
        "If you need to set ",
        {text: "color", styles: {color: 'yellow'}},
        " or ",
        {text: "Font size", styles: {fontSize: 18}},
        " or ",
        {text: "background color", styles: {backgroundColor: '#000055', padding: '0 4px'}},
        " or ",
        {text: "draw text in a box", styles: {border: '1px solid silver', borderRadius: 4, padding: '0 4px'}},
        ", you can do it by passing to above methods an array of objects with text and styles properties.",
    ]);
    await ui.dialog.buttons(["Next"]);
    
    ui.log("");
    ui.log("If you need to output a long text, you can use: ui.show.textBlock('text'):");
    ui.show.textBlock({text: longText, title: "Long text"});
    ui.log("Note that you have buttons to copy text to clipboard and open it in a separate VSCode window.");
    await ui.dialog.buttons(["Next"]);

    ui.log("");
    ui.log("You can display a grid using array of objects with: ui.show.gridFromJsonArray(data, options):");
    ui.show.gridFromJsonArray({
        data: someJsonForGrid,
        title: [{text: "Titles", styles: {color: 'lime'},}, " also can be styled"],
        columns: [
            { title: "Name", key: "name" },
            { title: "Description", key: "description" },
            { title: "Value", key: "value", width: 250 },
        ],
    });
    ui.log("Note that you have button to open it in a separate VSCode window. And by the way, you can open any json file in a grid using 'AV' button in the top right corner of the VSCode.");
    await ui.dialog.buttons(["Next"]);
    ui.log("");

    // Input

    ui.log([{text: "Inputs:", styles: {color: 'lime'}}]);
    ui.log("");
    ui.log("Input elements are required user interaction, so thay return a promise. You need to await for it or use .then() method.");
    ui.log("You can use: ui.dialog.confirm('message') to show a confirm dialog with No/Yes buttons or your custom buttons.");
    let pressedButton = await ui.dialog.confirm({
        title: "The confirm dialog",
        message: "This is dialog with no buttons provided, so default buttons displayed.\nPlease, press any.",
    });
    ui.log(["You pressed: ", {text: pressedButton ?? "", styles: {color: 'lime'}}, " button."]);
    
    pressedButton = await ui.dialog.confirm({
        title: "Confirm dialog with custom buttons",
        message: "This is dialog with custom buttons provided.\nPlease, press any.",
        buttons: ["Yes", "No", "Maybe"],
    });
    ui.log(["You pressed: ", {text: pressedButton ?? "", styles: {color: 'lime'}}, " button."]);

    ui.log("");
    ui.log("You can use: ui.dialog.textInput('message') to show a text input dialog.");
    const textInput = await ui.dialog.textInput("Please, type something");
    ui.log([
        "You typed: ", 
        {text: textInput?.result ?? "", styles: {color: 'lime'}}, 
        " text. And pressed ",
        {text: textInput?.resultButton ?? "", styles: {color: 'lime'}},
        " button.",
    ]);

    ui.log("");
    ui.text("Find more demo scripts in subfolders with more UI elements and more detailed.")
}

demoMain().finally(() => {
    process.exit(0);
});