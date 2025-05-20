import asyncio
from interactive_script_py import ui, styled_text
from utils import longText

async def window_show_text_demo():
    ui.success("Open text in new window demo.").font_size(18).print()

    ui.log("")
    ui.text("You can open text in new window.")
    await ui.dialog.buttons(["Show me"])

    ui.window.show_text({
        "text": longText,
        "language": "plaintext",
    })

    ui.log("")
    ui.success("End of demo.")

if __name__ == "__main__":
    asyncio.run(window_show_text_demo())