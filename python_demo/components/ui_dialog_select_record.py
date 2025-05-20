import asyncio
from interactive_script_py import ui, styled_text

someRecords = [
    { "id": 1, "name": "John Doe", "age": 30 },
    { "id": 2, "name": "Jane Smith", "age": 25 },
    { "id": 3, "name": "Alice Johnson", "age": 28 },
]

async def select_record_demo():
    ui.success("Select Record Demo").font_size(18).print()

    ui.log("")
    ui.text("You can use ui.dialog.selectRecord to select a record from json array.")
    response = await ui.dialog.select_record(someRecords)
    ui.show.text_block({
        "title": "Selected Record",
        "text": f"{response.result!r}",
    })

    ui.text("You can provide additional options like multiple selection, title, and buttons.")
    response = await ui.dialog.select_record({
        "records": someRecords,
        "multiple": True,
        "title": styled_text("Select Multiple Records").color("pink").value,
        "buttons": ["Cancel", styled_text("OK").color("gold").value],
    })
    ui.log("You have pressed: ") \
        .then(response.resultButton).color("lime") \
        .then(" button.") \
        .print()
    ui.show.text_block({
        "title": "Selected Records",
        "text": f"{response.result!r}",
    })

    ui.log("")
    ui.success("End of demo.")

if __name__ == "__main__":
    asyncio.run(select_record_demo())