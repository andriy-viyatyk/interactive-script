import asyncio
from interactive_script_py import ui, styled_text
from utils import longText

async def inline_text_input_demo():
    ui.success("Inline Text Input Demo").font_size(18).print()

    ui.log("")
    ui.text("Alternatively to ui.dialog.textInput you can use ui.inline.textInput to show input dialog inline:")
    text = await ui.inline.text_input("Enter some text:")
    ui.log("You entered: ") \
        .then(text.result).color("lightseagreen") \
        .then(" and pressed: ") \
        .then(text.resultButton).color("lightblue") \
        .then(" button.") \
        .print()

    ui.log("")
    ui.text("You can pass buttons and mark one as required using '!' character:")
    text = await ui.inline.text_input({
        "title": "Enter some text:",
        "buttons": ["Cancel", "!Ok"],
    })

    ui.log("")
    ui.text("You can provide own buttons and initial text:")
    text = await ui.inline.text_input({
        "title": "Enter some text:",
        "buttons": ["OK", "Cancel"],
        "result": "Initial text",
    })
    ui.log("You entered: ") \
        .then(text.result).color("lightseagreen") \
        .then(" and pressed: ") \
        .then(text.resultButton).color("lightblue") \
        .then(" button.") \
        .print()

    ui.log("")
    ui.text("You can style the title and buttons:")
    await ui.inline.text_input({
        "title": styled_text("Enter some text:").color("lightblue").value,
        "buttons": [
            styled_text("OK").color("lightgreen").value,
            styled_text("Cancel").color("red").value,
        ],
    })

    ui.log("")
    ui.text("In comparison to ui.dialog.textInput, ui.inline.textInput does not allow line breaks.")

    ui.log("")
    ui.success("End of Demo.")

if __name__ == "__main__":
    asyncio.run(inline_text_input_demo())