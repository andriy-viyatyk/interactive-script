import asyncio
from interactive_script_py import ui, styled_text

manyButtons = [f"Button {i + 1}" for i in range(100)]

async def buttons_demo():
    ui.success("Buttons Demo").font_size(18).print()

    ui.log("")
    ui.text('If you call ui.dialog.buttons([]) without buttons, it will display default one:')
    await ui.dialog.buttons([])
    ui.text("You can pass array of buttons to display:")
    pressedButton = await ui.dialog.buttons(["one", "two", "three"])
    ui.text("You pressed: ").then(pressedButton).color("lightseagreen").print()
    ui.text("You can style buttons text using styledText:")
    pressedButton = await ui.dialog.buttons([
        styled_text("button ").then("one").color("orange").value,
        styled_text("button ").then("two").color("springgreen").value,
        styled_text("button ").then("three").color("aqua").value,
    ])
    ui.text("You pressed: ").then(pressedButton).color("lightseagreen").print()

    ui.log("")
    ui.text("Many buttons will wrap by lines:")
    await ui.dialog.buttons(manyButtons)

    ui.log("")
    ui.text("You can provide bodyStyles to display them for example in a grid:")
    await ui.dialog.buttons({
        "buttons": manyButtons,
        "bodyStyles": {
            "display": "grid",
            "gridTemplateColumns": "repeat(5, 1fr)",
            "gap": "4px",
            "padding": "4px",
        },
    })

    ui.success("\nDemo completed.")

if __name__ == "__main__":
    asyncio.run(buttons_demo())