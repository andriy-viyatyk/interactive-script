import asyncio
import json
from interactive_script_py import ui, styled_text

async def grid_input_demo():
    ui.success("Grid Input Demo").font_size(18).print()

    ui.log("")
    ui.text("You can use ui.dialog.gridInput() command to display editable grid where user can add, edit and delete rows.")
    ui.text("User also can paste range of cells into the grid for example from Excel.")

    result = await ui.dialog.grid_input({
        "title": "Grid Input",
        "columns": [
            { "key": "name", "title": "Name", "width": 200 },
            { "key": "age", "title": "Age", "width": 100, "dataType": "number" },
            { "key": "role", "title": "Role", "width": 150, "options": ["Admin", "User", "Guest"] },
            { "key": "active", "title": "Active", "width": 80, "dataType": "boolean" }
        ],
        "result": [{}], # you can add empty first row here if needed
    })

    ui.log("Grid Input Result:")
    ui.show.text_block({
        "title": "Grid Input Result",
        "text": json.dumps(result.result, indent=4)
    })

    ui.log("")
    ui.text("You can also provide initial data or data for edit without posibility ot add or delete rows:")

    result = await ui.dialog.grid_input({
        "title": styled_text("Grid").color("lightblue").then(" input").value,
        "columns": [
            { "key": "hiddenId", "hidden": True }, # actually this hidden column doesn't needed. Provided id in result will be returned back anyway.
            { "key": "name", "title": "Name", "width": 200, "readonly": True },
            { "key": "age", "title": "Age", "width": 100, "dataType": "number", "readonly": True },
            { "key": "role", "title": "Role", "width": 150, "options": ["Admin", "User", "Guest"] },
            { "key": "active", "title": "Active", "width": 80, "dataType": "boolean" }
        ],
        "result": [
            { "hiddenId": 1, "name": "John Doe", "age": 30, "role": "Admin", "active": True },
            { "hiddenId": 2, "name": "Jane Smith", "age": 25, "role": "User", "active": False }
        ],
        "editOnly": True, # only edits without adding or deleting rows
        "buttons": ["Cancel", "Save"]
    })

    ui.show.text_block({
        "title": "Editing Result",
        "text": json.dumps(result.result, indent=4)
    })
    
    ui.log("You pressed: ") \
        .then(result.resultButton).color("lightblue") \
        .print()

    ui.log("")
    ui.success("End of Demo.")

if __name__ == "__main__":
    asyncio.run(grid_input_demo())