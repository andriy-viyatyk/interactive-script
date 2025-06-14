import asyncio
from interactive_script_py import ui

async def file_show_open_demo():
    ui.text("File Open Dialog Demo").color("lightseagreen").font_size(18).print()

    ui.log("")
    ui.text("You can simply call the `ui.file.show_open()` method to display open file component in ui.")
    files = await ui.file.show_open()
    ui.log("You have selected file:")
    for file in files:
        ui.text(file).color("lightskyblue").print()

    ui.log("")
    ui.text("You can also specify options for the open dialog, like `canSelectMany`, `filters`, and `label`.")
    files = await ui.file.show_open({
        "canSelectMany": True,
        "filters": {
            "Text files": ["txt", "md"],
            "JavaScript files": ["js"],
            "All files": ["*"]
        },
        "label": "Select many",
    })
    ui.log("You have selected file:")
    for file in files:
        ui.text(file).color("lightskyblue").print()

    ui.log("")
    ui.success("End of Demo")

if __name__ == "__main__":
    asyncio.run(file_show_open_demo())