import asyncio
from interactive_script_py import ui

long_text = (
    "In a quiet valley nestled between tall mountains and peaceful rivers, there was a village that "
    "thrived for many generations. The villagers lived simple yet fulfilling lives, working the land, "
    "raising animals, and crafting tools that were known across nearby regions. Among them was a young "
    "villager who dreamed of adventure and exploration. This young villager often gazed at the horizon, "
    "wondering what lay beyond the mountains and rivers."
)

some_json_for_grid = [
    {"name": f"Item {i}", "description": f"Description for item {i}", "value": i}
    for i in range(1, 10)
]

async def demo_main():
    ui.clear()
    ui.log([{"text": "Interactive Script Demo", "styles": {"fontSize": 18, "color": "cyan"}}])
    ui.log("After importing ui from 'interactive_script_py':")
    ui.log('from interactive_script_py import ui').border("silver").style({"padding": 8}).print()
    ui.log("what you can do running it using 'Interactive Script' extension in VSCode:")
    ui.log("")

    # Output
    ui.log([{"text": "Output:", "styles": {"color": "lime"}}])
    ui.log("")
    ui.log("You can print text as you do with print or ui.log('text')")
    print("You can use print as well.")
    ui.error("Print error message using: ui.error('text')")
    ui.warn("Print warning message using: ui.warn('text')")
    ui.info("Print info message using: ui.info('text')")
    ui.success("Print success message using: ui.success('text')")
    ui.log([
        "If you need to set ",
        {"text": "color", "styles": {"color": "yellow"}},
        " or ",
        {"text": "Font size", "styles": {"fontSize": 18}},
        " or ",
        {"text": "background color", "styles": {"backgroundColor": "#000055", "padding": "0 4px"}},
        " or ",
        {"text": "draw text in a box", "styles": {"border": "1px solid silver", "borderRadius": 4, "padding": "0 4px"}},
        ", you can do it by passing to above methods an array of objects with text and styles properties.",
    ])
    await ui.dialog.buttons(["Next"])

    ui.log("")
    ui.log("If you need to output a long text, you can use: ui.show.text_block('text'):")
    ui.show.text_block({"text": long_text, "title": "Long text"})
    ui.log("Note that you have buttons to copy text to clipboard and open it in a separate VSCode window.")
    await ui.dialog.buttons(["Next"])

    ui.log("")
    ui.log("You can display a grid using array of objects with: ui.show.grid_from_list(data, options):")
    ui.show.grid_from_list({
        "data": some_json_for_grid,
        "title": [{"text": "Titles", "styles": {"color": "lime"}}, " also can be styled"],
        "columns": [
            {"title": "Name", "key": "name"},
            {"title": "Description", "key": "description"},
            {"title": "Value", "key": "value", "width": 250},
        ]
    })
    ui.log("Note that you have button to open it in a separate VSCode window. And by the way, you can open any json file in a grid using 'AV' button in the top right corner of the VSCode.")
    await ui.dialog.buttons(["Next"])
    ui.log("")

    # Input
    ui.log([{"text": "Inputs:", "styles": {"color": "lime"}}])
    ui.log("")
    ui.log("Input elements require user interaction and return values, so they should be awaited.")

    ui.log("You can use: ui.dialog.confirm('message') to show a confirm dialog.")
    pressed_button = await ui.dialog.confirm({
        "title": "The confirm dialog",
        "message": "This is dialog with no buttons provided, so default buttons displayed.\nPlease, press any."
    })
    ui.log(["You pressed: ", {"text": pressed_button or "", "styles": {"color": "lime"}}, " button."])

    pressed_button = await ui.dialog.confirm({
        "title": "Confirm dialog with custom buttons",
        "message": "This is dialog with custom buttons provided.\nPlease, press any.",
        "buttons": ["Yes", "No", "Maybe"]
    })
    ui.log(["You pressed: ", {"text": pressed_button or "", "styles": {"color": "lime"}}, " button."])

    ui.log("")
    ui.log("You can use: ui.dialog.text_input('message') to show a text input dialog.")
    text_input = await ui.dialog.text_input("Please, type something")
    ui.log([
        "You typed: ",
        {"text": (text_input.result if text_input.result else ""), "styles": {"color": "lime"}},
        " text. And pressed ",
        {"text": (text_input.resultButton if text_input.resultButton else ""), "styles": {"color": "lime"}},
        " button.",
    ])

    ui.log("")
    ui.text("Find more demo scripts in subfolders with more UI elements and more detailed.")


if __name__ == "__main__":
    asyncio.run(demo_main())
