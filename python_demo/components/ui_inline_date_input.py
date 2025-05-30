import asyncio
from datetime import date
from interactive_script_py import ui, styled_text

async def inline_date_input_demo():
    ui.success("ui.inline.dateInput demo").font_size(18).print()

    ui.text("\nYou can use inline.dateInput to get a date input from the user.")
    data = await ui.inline.date_input()
    ui.log("You entered: ") \
        .then(data.result.isoformat() if data.result else "").color("lightblue") \
        .then(" and pressed: ") \
        .then(data.resultButton).color("lightblue") \
        .then(" button.") \
        .print()

    ui.log("\nYou can also provide title, initial date, and buttons.")
    data = await ui.inline.date_input({
        "title": "Select a date",
        "result": date(2020, 1, 1),
        "buttons": ["Cancel", "!OK"],
    })
    ui.log("You entered: ") \
        .then(data.result.isoformat() if data.result else "").color("lightblue") \
        .then(" and pressed: ") \
        .then(data.resultButton).color("lightblue") \
        .then(" button.") \
        .print()

    ui.log("\nAnd you can style title and buttons")
    await ui.inline.date_input({
        "title": styled_text("Styled title").color("lightseagreen").value,
        "buttons": [
            styled_text("OK").color("lightpink").value,
        ]
    })

    ui.log("\nEnd of demo.")
    
if __name__ == "__main__":
    asyncio.run(inline_date_input_demo())