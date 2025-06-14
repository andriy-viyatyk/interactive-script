import asyncio
from interactive_script_py import ui

async def file_open_demo():
    ui.text("File Open Dialog Demo").color("lightseagreen").font_size(18).print()

    ui.log("")
    ui.text("You can simple call the `ui.file.open()` method to open a file dialog.")
    files = await ui.file.open()
    ui.log("You selected the following file:") \
        .then(f"\n{files[0] if len(files) > 0 else "No file selected"}") \
        .color("lime") \
        .print()

    ui.log("")
    ui.text("You can pass options to the `ui.file.open()`.")
    files = await ui.file.open({
        "label": "Select files",  # label for the 'Open' button
        "canSelectMany": True,
        "filters": {
            "Text Files": ["txt", "md"],
            "Image Files": ["jpg", "png", "gif"],
            "TypeScript": ["ts", "tsx"],
            "All Files": ["*"]
        }
    })
    ui.log("You selected the following file:")
    for file in files:
        ui.log(file).color("lightgreen").print()

    ui.log("")
    ui.success("End of Demo")

if __name__ == "__main__":
    asyncio.run(file_open_demo())