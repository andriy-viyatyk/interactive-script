import ui from 'interactive-script-js';

async function fileShowOpenFolderDemo() {
    ui.text("Folder Open Dialog Demo").color("lightseagreen").fontSize(18).print();

    ui.log("");
    ui.text("You can simply call the `ui.file.showOpenFolder()` method to display open folder component in ui.");
    let folders = await ui.file.showOpenFolder();
    ui.log("You have selected folder:");
    folders?.forEach(folder => {
        ui.text(folder).color("lightskyblue").print();
    });

    ui.log("");
    ui.text("You can also specify options for the open dialog, like `canSelectMany`, `buttons`, and `label`.");
    folders = await ui.file.showOpenFolder({
        canSelectMany: true,
        label: "Select many",
        buttons: ["Cancel", "!Select"],
    });
    ui.log("You have selected folder:");
    folders?.forEach(folder => {
        ui.text(folder).color("lightskyblue").print();
    });

    ui.log("");
    ui.success("End of Demo");
}

fileShowOpenFolderDemo()
    .catch(e => console.error(e))
    .finally(() => process.exit(0));