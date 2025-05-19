import asyncio
from interactive_script_py import ui, styled_text
from utils import longText

async def input_text_demo():
    ui.success("Text Input Demo").font_size(18).print()

    ui.log("")
    ui.text("You can show input dialog:")
    response = await ui.dialog.text_input("Enter some text:")
    ui.log("You entered: ") \
        .then(response.result).color("lightseagreen") \
        .then(" and pressed: ") \
        .then(response.resultButton).color("lightblue") \
        .then(" button.") \
        .print()

    ui.log("")
    ui.text("You can provide own buttons and initial text:")
    response = await ui.dialog.text_input({
        "title": "Enter some text:",
        "buttons": ["OK", "Cancel"],
        "result": "Initial text",
    })
    ui.log("You entered: ") \
        .then(response.result).color("lightseagreen") \
        .then(" and pressed: ") \
        .then(response.resultButton).color("lightblue") \
        .then(" button.") \
        .print()

    ui.log("")
    ui.text("You can style the title and buttons:")
    await ui.dialog.text_input({
        "title": styled_text("Enter some text:").color("lightblue").value,
        "buttons": [
            styled_text("OK").color("lightgreen").value,
            styled_text("Cancel").color("red").value,
        ],
    })

    ui.log("")
    ui.text("Long text will be wrapped by line breaks and scrolled:")
    await ui.dialog.text_input({
        "title": "Enter some text:",
        "buttons": ["OK"],
        "result": longText,
    })

    ui.log("")
    ui.success("End of Demo.")

asyncio.run(input_text_demo())