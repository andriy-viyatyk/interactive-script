import asyncio
from interactive_script_py import ui, styled_text

async def styled_text_demo():
    ui.text("Styled Text Demo").color("lightseagreen").font_size(18).print()

    ui.log("You can style text using syntax: ui.text('text').color('pink').fontSize(18).print()")
    ui.log("It works for:")
    ui.text("ui.text()")
    ui.log("ui.log()")
    ui.info("ui.info()")
    ui.success("ui.success()")
    ui.warn("ui.warn()")
    ui.error("ui.error()")
    ui.text("The difference only in base color")
    ui.log("");

    ui.text("You can define text ") \
        .then("color").color("yellow") \
        .then(", text ") \
        .then("background color").background("#000055") \
        .then(", change ") \
        .then("font size").font_size(18) \
        .then(" or make ") \
        .then("bordered text").border("silver") \
        .then(", or make it ") \
        .then("all together").color("yellow").background("#000055").font_size(18).border("silver") \
        .print()

    ui.text("You can ") \
        .then("underline text").underline() \
        .then(", make it ") \
        .then("italic").italic() \
        .then(", and also ") \
        .then("bold").bold() \
        .print()

    ui.log("")
    ui.text("Also you can use style() method to set other css styles like: ") \
        .then("text transform").style({ "textTransform": "uppercase" }) \
        .then(", ") \
        .then("letter spacing").style({ "letterSpacing": "2px" }) \
        .then(", ") \
        .then("strike through").style({ "textDecoration": "line-through" }) \
        .then(", etc.") \
        .print()

    ui.log("")
    ui.text([
        "If you need to generate styled text ",
        {"text": "dynamically", "styles": {"color": 'yellow'}},
        " you can use array of objects with text and styles properties.",
        {"text": "\nFor example: ui.text([ {text: 'text', styles: {color: 'yellow'}} ])", "styles": { "fontStyle": "italic" }},
    ])

    ui.log("")
    ui.text("You can use styledText() function to create styled labels for components")
    ui.log("For example in ui.dialog.buttons, please press any:")
    pressedButton = await ui.dialog.buttons([
        styled_text("one").color("yellow").value,
        styled_text("two").color("lime").value,
        styled_text("three").color("lightcoral").value,
    ])
    ui.log("You have pressed: ") \
        .then(pressedButton).color("lightseagreen") \
        .then(" button.") \
        .print()

asyncio.run(styled_text_demo())