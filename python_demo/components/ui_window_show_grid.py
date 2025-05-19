import asyncio
from interactive_script_py import ui, styled_text
from utils import generate_rows

async def window_show_grid_demo():
    ui.success("Open grid in new window demo.").font_size(18).print()

    ui.log("")
    ui.text("You can open json array as grid in new window.")
    await ui.dialog.buttons(["Show me"])

    ui.window.show_grid({
        "data": generate_rows(10000),
        "title": "Data from your script",
    })

    ui.log("")
    ui.success("End of demo.")

asyncio.run(window_show_grid_demo())