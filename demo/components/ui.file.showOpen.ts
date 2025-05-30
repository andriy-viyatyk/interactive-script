import ui from 'interactive-script-js';

async function fileShowOpenDemo() {
    ui.text("File Open Dialog Demo").color("lightseagreen").fontSize(18).print();

    ui.log("");
    ui.text("You can simply call the `ui.file.showOpen()` method to display open file component in ui.");
    let files = await ui.file.showOpen();
    ui.log("You have selected file:");
    files?.forEach(file => {
        ui.text(file).color("lightskyblue").print();
    });

    ui.log("");
    ui.text("You can also specify options for the open dialog, like `canSelectMany`, `filters`, and `title`.");
    files = await ui.file.showOpen({
        canSelectMany: true,
        filters: {
            "Text files": ["txt", "md"],
            "JavaScript files": ["js"],
            "All files": ["*"]
        },
        label: "Select many",
    });
    ui.log("You have selected file:");
    files?.forEach(file => {
        ui.text(file).color("lightskyblue").print();
    });

    ui.log("");
    ui.success("End of Demo");
}

fileShowOpenDemo().finally(() => {
    process.exit(0);
});