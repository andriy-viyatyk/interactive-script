import ui from 'interactive-script-js';

async function fileOpenFolderDemo() {
    ui.text("File Open Folder Dialog Demo").color("lightseagreen").fontSize(18).print();

    ui.log("");
    ui.text("You can simple call the `ui.file.openFolder()` method to open a folder dialog.");
    let folder = await ui.file.openFolder();
    ui.log("You selected the following folder:")
        .then(`\n${folder ? folder : "No folder selected"}`)
        .color("lime")
        .print();

    ui.log("");
    ui.text("You can pass options to the `ui.file.openFolder()`.");
    folder = await ui.file.openFolder({
        label: "Select Folder", // label for the 'Open' button
        canSelectMany: true, // allow selecting multiple folders
        result: ["C:\\"], // initial folder to open
    });
    ui.log("You selected the following folder:");
    ui.log(folder.join("\n")).color("lightgreen").print();

    ui.log("");
    ui.success("End of Demo");
}

fileOpenFolderDemo()
    .catch(e => console.error(e))
    .finally(() => process.exit(0));