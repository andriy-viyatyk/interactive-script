import asyncio
from interactive_script_py import ui

async def file_show_open_folder_demo():
    ui.text("Folder Open Dialog Demo").color("lightseagreen").font_size(18).print()

    ui.log("")
    ui.text("You can simply call the `ui.file.show_open_folder()` method to display open folder component in ui.")
    folders = await ui.file.show_open_folder()
    ui.log("You have selected folder:")
    for folder in folders:
        ui.text(folder).color("lightskyblue").print()

    ui.log("")
    ui.text("You can also specify options for the open dialog, like `canSelectMany`, `buttons`, and `label`.")
    folders = await ui.file.show_open_folder({
        "canSelectMany": True,
        "label": "Select many",
        "buttons": ["Cancel", "!Select"],
    })
    ui.log("You have selected folder:")
    for folder in folders:
        ui.text(folder).color("lightskyblue").print()

    ui.log("")
    ui.success("End of Demo")

if __name__ == "__main__":
    asyncio.run(file_show_open_folder_demo())