import ui from 'interactive-script-js';

async function fileSaveDemo() {
    ui.text("File Save Dialog Demo").color("lightseagreen").fontSize(18).print();

    ui.log("");
    ui.text("You can simple call the `ui.file.save()` method to open a file save dialog.");
    let file = await ui.file.save();
    ui.log("You specified the following file path to save:")
        .then(`\n${file ? file : "No file selected"}`)
        .color("lime")
        .print();

    ui.log("");
    ui.text("You can pass options to the `ui.file.save()`.");
    file = await ui.file.save({
        label: "Save File As", // label for the 'Save' button
        result: "example.txt", // default file name
        filters: {
            "Text Files": ["txt", "md"],
            "Image Files": ["jpg", "png", "gif"],
            'TypeScript': ['ts', 'tsx'],
            "All Files": ["*"]
        }
    });
    ui.log("You specified the following file path to save:");
    ui.log(file).color("lightgreen").print();

    ui.log("");
    ui.success("End of Demo");
}

fileSaveDemo()
    .catch(e => console.error(e))
    .finally(() => process.exit(0));