import asyncio
from interactive_script_py import ui, styled_text
from utils import generate_rows, generate_class_rows

async def grid_demo():
    ui.text("Grid Demo").color("lightseagreen").font_size(18).print()

    ui.log("")
    ui.text("You can display a grid using array of objects with: ui.show.gridFromList(data, options):")
    ui.show.gridFromList(generate_class_rows(10000))
    await ui.dialog.buttons(["Next"])

    ui.log("")
    ui.text("You can define title and columns by passing options: ui.show.gridFromList({data, title, columns }):")
    ui.show.gridFromList({
        "data": generate_rows(10000),
        "title": styled_text("Grid").color("yellow").then(" title").value,
        "columns": [
            { "title": "Name", "key": "name", "width": 200 },
            { "title": "City", "key": "city" },
            { "title": "Phone", "key": "phone", "width": 400 },
        ],
    })

    ui.log("")
    ui.text("You can open grid in main VSCode window by clicking 'Open in separate window' button in the grid title bar.")
    ui.info("Also you can open any json file in a grid using 'AV' button in the top right corner of the VSCode.")

asyncio.run(grid_demo())