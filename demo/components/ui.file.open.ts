import ui from 'interactive-script-js';

async function fileOpenDemo() {
    ui.text("File Open Dialog Demo").color("lightseagreen").fontSize(18).print();

    ui.log("");
    ui.text("You can simple call the `ui.file.open()` method to open a file dialog.");
    let files = await ui.file.open();
    ui.log("You selected the following file:")
        .then(`\n${files.length > 0 ? files[0] : "No file selected"}`)
        .color("lime")
        .print();

    ui.log("");
    ui.text("You can pass options to the `ui.file.open()`.");
    files = await ui.file.open({
        label: "Select files", // label for the 'Open' button
        canSelectMany: true,
        filters: {
            "Text Files": ["txt", "md"],
            "Image Files": ["jpg", "png", "gif"],
            'TypeScript': ['ts', 'tsx'],
            "All Files": ["*"]
        }
    });
    ui.log("You selected the following file:");
    files.forEach((file) => {
        ui.log(file).color("lightgreen").print();
    });

    ui.log("");
    ui.success("End of Demo");
}

fileOpenDemo()
    .catch(e => console.error(e))
    .finally(() => process.exit(0));