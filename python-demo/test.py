import asyncio
import traceback
from interactive_script_py import ui, styled_text


async def main():
    try:
        ui.text("This is a text").then(" with some color").color("yellow").print()
        ui.log("This is a log")
        ui.info("This is an info")
        ui.warn("This is a warning")
        ui.error("This is an error")
        ui.success("This is a success")

        pressedButton = await ui.dialog.confirm(
            {
                "title": styled_text("Confirm").color("lightseagreen").value,
                "message": "Do you want to proceed?",
                "buttons": ["Cancel", "Maybe", "Yes"],
            }
        )
        print("You have pressed :", pressedButton)
    except Exception:
        traceback.print_exc()


asyncio.run(main())
