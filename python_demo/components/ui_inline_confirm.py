import asyncio
from interactive_script_py import ui, styled_text
from utils import generate_rows

async def inline_confirm_demo():
    ui.text("Inline Confirm Dialog Demo").color("lightseagreen").font_size(18).print()

    ui.text("In addition to ui.dialog.confirm, here is its compact version.")
    ui.log("")

    pressedButton = await ui.inline.confirm("Single confirm message with default buttons.")
    ui.log("You pressed: ") \
        .then(pressedButton).color("lime") \
        .print()

    ui.log("")
    pressedButton = await ui.inline.confirm({
        "message": "Dialog with message and custom buttons.",
        "buttons": ["Custom button 1", "Custom button 2", "Custom button 3"],
    })
    ui.log("You pressed: ") \
        .then(pressedButton).color("lime") \
        .print()

    ui.log("")
    pressedButton = await ui.inline.confirm({
        "message": styled_text("Dialog with ").then("styled text").color("lime").then(" in message and custom buttons.").value,
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
    asyncio.run(inline_confirm_demo())