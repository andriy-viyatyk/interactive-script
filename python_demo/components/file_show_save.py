import asyncio
from interactive_script_py import ui

async def file_show_save_demo():
    ui.text("File Save Dialog Demo").color("lightseagreen").font_size(18).print()

    ui.log("")
    ui.text("You can simply call the `ui.file.show_save()` method to display save file component in ui.")
    file = await ui.file.show_save()
    ui.log('Selected file ') \
       .then(file) \
       .color("lightskyblue") \
       .print()

    ui.log("")
    ui.text("You can also specify options for the save dialog, like `filters`, `buttons`, and `label`.")
    file = await ui.file.show_save({
        "filters": {
            "Text files": ["txt", "md"],
            "JavaScript files": ["js"],
            "All files": ["*"]
        },
        "buttons": ["Cancel", "!Save"],
        "label": "Select many",
    })
    ui.log('Selected file ') \
       .then(file) \
       .color("lightskyblue") \
       .print()

    ui.log("")
    ui.success("End of Demo")

if __name__ == "__main__":
    asyncio.run(file_show_save_demo())