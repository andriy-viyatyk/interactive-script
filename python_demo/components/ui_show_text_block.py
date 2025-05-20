import asyncio
from interactive_script_py import ui, styled_text
from utils import longText

async def text_block_demo():
    ui.success("TextBlock Demo").font_size(18).print()

    ui.log("")
    ui.text("You can show large text in a block that have options to copy and open in a new window.")
    ui.show.text_block(longText)

    ui.log("")
    ui.text("You can also add styled title")
    ui.show.text_block({
        "text": "This is text block with styled title.",
        "title": styled_text("Styled Title").color("yellow").value,
    })

    ui.log("")
    ui.success("End of Demo.")
    
if __name__ == "__main__":
    asyncio.run(text_block_demo())