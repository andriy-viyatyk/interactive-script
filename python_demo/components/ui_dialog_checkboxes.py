import asyncio
from interactive_script_py import ui, styled_text

manyOptions = [f"Option {i + 1}" for i in range(100)]

async def checkboxes_demo():
    ui.success("Checkboxes demo").font_size(18).print()
    ui.log("")
    ui.text("You can display a list of checkboxes using: ui.dialog.checkboxes(data):")
    response = await ui.dialog.checkboxes([
        "Item 1",
        "Item 2",
        "Item 3",
    ])
    ui.log(f"You selected: {', '.join(response.result) if response.result else ''}")
    ui.text("Without buttons provided it displays a default button 'Proceed'.")

    ui.log("")
    ui.text("You can also provide a title and buttons and default checked state:")
    response = await ui.dialog.checkboxes({
        "title": "Select items",
        "items": [
            { "label": "Item 1", "checked": True },
            { "label": "Item 2" },
            { "label": "Item 3" },
        ],
        "buttons": ["Cancel", "Ok"],
    })
    ui.log(f"You selected: {', '.join(response.result) if response.result else ''}")
    ui.log(f'You pressed: "{response.resultButton}" button.')

    ui.log("")
    ui.text("You can style text of elements using styledText() function:")
    response = await ui.dialog.checkboxes({
        "title": styled_text("Select ").then("items").color("yellowgreen").value,
        "items": [
            { "label": styled_text("Item 1").color("lime").value },
            { "label": styled_text("Item 2").color("aqua").value },
            { "label": styled_text("Item 3").color("lightgreen").value },
        ],
        "buttons": [
            "Cancel",
            styled_text("Ok").color("yellowgreen").value,
        ],
    })
    ui.log(f"You selected: {', '.join(response.result) if response.result else ''}")
    ui.log(f'You pressed: "{response.resultButton}" button.')

    ui.log("")
    ui.text("Many options will wrap by lines:")
    await ui.dialog.checkboxes(manyOptions)

    ui.log("")
    ui.text("You can provide bodyStyles to display them for example in a grid:")
    await ui.dialog.checkboxes({
        "items": [{"label": item} for item in manyOptions],
        "bodyStyles": {
            "display": "grid",
            "gridTemplateColumns": "repeat(5, 1fr)",
            "gap": "4px",
            "padding": "4px",
        },
    })

    ui.log("")
    ui.success("End of demo.")
    
if __name__ == "__main__":
    asyncio.run(checkboxes_demo())