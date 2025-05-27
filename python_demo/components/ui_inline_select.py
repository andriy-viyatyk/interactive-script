import asyncio
from interactive_script_py import ui, styled_text
from utils import generate_rows

async def inline_select_demo():
    ui.success("Inline Select Demo").font_size(18).print()

    ui.log("")
    ui.text("You can use ui.inlineSelect to select a value from a list of simple options.")
    response = await ui.inline.select({
        "label": "Select an option",
        "options": ["Option 1", "Option 2", "Option 3"],
    })
    ui.log(f"You selected: {response.result}").color("lightcoral").print()

    ui.log("")
    ui.text("You can also use ui.inlineSelect with objects, specifying a label key.")
    response2 = await ui.inline.select({
        "label": "Select an object",
        "options": [
            {
                **item,
                "label": f"{item["name"]} ({item["city"]}, {item["country"]})"
            }
            for item in generate_rows(1000)
        ],
        "labelKey": "label",
    })
    ui.log(f"You selected: {response2.result["label"] if response2.result else ""}").color("lightcoral").print()

    ui.log("")
    ui.text("You can also provide your buttons. Also start button with '!' to make selection required to click it.")
    response3 = await ui.inline.select({
        "label": "Select an option with buttons",
        "options": ["Button 1", "Button 2", "Button 3"],
        "buttons": ["Cancel", "!Select"],
    })
    ui.log(f"You selected: ${response3.result}").color("lightcoral") \
        .then(" and pressed ") \
        .then(response3.resultButton).color("lightseagreen") \
        .then(" button") \
        .print()

    ui.log("")
    ui.success("End of demo.")
    
if __name__ == "__main__":
    asyncio.run(inline_select_demo())