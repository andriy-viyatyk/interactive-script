import asyncio
from interactive_script_py import ui, styled_text

async def confirm_dialog_demo():
    ui.text("Confirm Dialog Demo") \
        .color("lightseagreen") \
        .font_size(18) \
        .print()

    pressedButton = await ui.dialog.confirm("Single confirm message with default buttons.")
    ui.log("You pressed: ").then(pressedButton).color("lime").print()

    ui.log("")
    pressedButton = await ui.dialog.confirm({
        "title": "Dialog title",
        "message": "Dialog with title, message and custom buttons.",
        "buttons": ["Custom button 1", "Custom button 2", "Custom button 3"],
    })
    ui.log("You pressed: ").then(pressedButton).color("lime").print()

    ui.log("")
    pressedButton = await ui.dialog.confirm({
        "title": styled_text("Dialog").color("yellow").then(" title").value,
        "message": styled_text("Dialog with ").then("styled text").color("lime").then(" in title, message and custom buttons.").value,
        "buttons": [
            styled_text("button ").then("one").color("orange").value,
            styled_text("button ").then("two").color("springgreen").value,
            styled_text("button ").then("three").color("aqua").value,
        ],
    })
    ui.log("You pressed: ") \
        .then(pressedButton).color("lime") \
        .print()


if __name__ == "__main__":
    asyncio.run(confirm_dialog_demo())