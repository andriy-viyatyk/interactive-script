import ui from 'interactive-script-js';

async function fileShowSaveDemo() {
    ui.text("File Save Dialog Demo").color("lightseagreen").fontSize(18).print();

    ui.log("");
    ui.text("You can simply call the `ui.file.showSave()` method to display save file component in ui.");
    let file = await ui.file.showSave();
    ui.log('Selected file ')
       .then(file)
       .color("lightskyblue")
       .print();

    ui.log("");
    ui.text("You can also specify options for the save dialog, like `filters`, and `label`.");
    file = await ui.file.showSave({
        filters: {
            "Text files": ["txt", "md"],
            "JavaScript files": ["js"],
            "All files": ["*"]
        },
        label: "Save As",
    });
    ui.log('Selected file ')
       .then(file)
       .color("lightskyblue")
       .print();

    ui.log("");
    ui.success("End of Demo");
}

fileShowSaveDemo()
    .catch(e => console.error(e))
    .finally(() => process.exit(0));