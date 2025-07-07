import asyncio
from interactive_script_py import ui

async def file_open_folder_demo():
    ui.text("File Open Folder Dialog Demo").color("lightseagreen").font_size(18).print()

    ui.log("")
    ui.text("You can simple call the `ui.file.open_folder()` method to open a folder dialog.")
    folder = await ui.file.open_folder()
    ui.log("You selected the following folder:") \
        .then(f"\n{folder if folder else 'No folder selected'}") \
        .color("lime") \
        .print()

    ui.log("")
    ui.text("You can pass options to the `ui.file.open_folder()`.")
    folder = await ui.file.open_folder({
        "label": "Select Folder",  # label for the 'Open' button
        "canSelectMany": True,     # allow selecting multiple folders
        "result": ["C:\\"],        # initial folder to open
    })
    ui.log("You selected the following folder:") \
        .then(f"\n{folder if folder else 'No folder selected'}") \
        .color("lime") \
        .print()

    ui.log("")
    ui.success("End of Demo")

if __name__ == "__main__":
    asyncio.run(file_open_folder_demo())