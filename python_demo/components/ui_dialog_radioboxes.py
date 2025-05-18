import asyncio
from datetime import date
from interactive_script_py import ui, styled_text

manyOptions = [f"Option {i + 1}" for i in range(100)]

async def radioboxes_demo():
    ui.success("Radioboxes demo").font_size(18).print()

    ui.log("")
    ui.text("You can display a list of radioboxes using: ui.dialog.radioboxes():")
    selected = await ui.dialog.radioboxes(["one", "two", "three"])
    ui.log("You selected: ") \
        .then(selected.result).color("gold") \
        .then(" and pressed: ") \
        .then(selected.resultButton).color("gold") \
        .then(" button.") \
        .print()

    ui.log("")
    ui.text("You can also provide a title, buttons and default checked state:")
    selected = await ui.dialog.radioboxes({
        "title": "Select items",
        "items": ["one", "two", "three"],
        "result": "three",
        "buttons": ["Cancel", "Ok"],
    })
    ui.log("You selected: ") \
        .then(selected.result).color("gold") \
        .then(" and pressed: ") \
        .then(selected.resultButton).color("gold") \
        .then(" button.") \
        .print()

    ui.log("")
    ui.text("You can style text of elements using styledText() function:")
    selected = await ui.dialog.radioboxes({
        "title": styled_text("Select ").then("items").color("yellowgreen").value,
        "items": [
            styled_text("Item 1").color("lime").value,
            styled_text("Item 2").color("aqua").value,
            styled_text("Item 3").color("lightgreen").value,
        ],
        "buttons": [
            "Cancel",
            styled_text("Ok").color("yellowgreen").value,
        ],
    })
    ui.log("You selected: ") \
        .then(selected.result).color("gold") \
        .then(" and pressed: ") \
        .then(selected.resultButton).color("gold") \
        .then(" button.") \
        .print()

    ui.log("")
    ui.text("Many options will wrap by lines:")
    await ui.dialog.radioboxes(manyOptions)

    ui.log("")
    ui.text("You can provide bodyStyles to display them for example in a grid:")
    await ui.dialog.radioboxes({
        "items": manyOptions,
        "bodyStyles": {
            "display": "grid",
            "gridTemplateColumns": "repeat(5, 1fr)",
            "gap": "4px",
            "padding": "4px",
        },
    })

    ui.log("")
    ui.success("End of demo.")

asyncio.run(radioboxes_demo())