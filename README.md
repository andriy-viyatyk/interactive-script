# Interactive Script

**Interactive Script** is a Visual Studio Code extension that lets you run Node.js **and now Python** scripts interactively inside VS Code, using a dedicated **"Script UI"** panel. Your scripts can dynamically output styled text, interactive dialogs, grids, progress indicators, and more — all rendered inside the editor, without leaving VS Code.

[![Demo Video](https://raw.githubusercontent.com/andriy-viyatyk/interactive-script/main/images/demo.gif)](https://github.com/andriy-viyatyk/interactive-script)


⚠️ **Important Compatibility Warning** ⚠️

"Interactive Script" relies on external client libraries (`interactive-script-js` for JavaScript/TypeScript and `interactive-script-py` for Python) to enable interactive features.

**It is crucial that the version of your installed client library is compatible with your "Interactive Script" VS Code extension version.**

VS Code extensions update automatically, but client libraries must be updated manually (`npm update` or `pip install --upgrade`). **Incompatible versions may lead to unexpected behavior or breaking changes.**

Please refer to the [**Version Compatibility Guide**](documentation/compatibility.md) for detailed information on matching extension and client library versions. We strongly recommend keeping your client libraries up-to-date with the extension.


## Key Features

- Adds a **"Script UI"** view in the bottom panel of VS Code
- Shows a **"Run"** button when a `.js`, `.ts`, or `.py` file is active, to execute the script
- Spawns a Node.js, ts-node, or Python process, streaming `stdout` and `stdin` to/from the **Script UI** panel
- Requires the [`interactive-script-js`](https://www.npmjs.com/package/interactive-script-js) or [`interactive-script-py`](https://pypi.org/project/interactive-script-py/) library to build interactive scripts with:
  - Styled log output (`ui.log`, `ui.error`, `ui.warn`, `ui.success`, etc.)
  - Interactive dialogs: buttons, confirms, text inputs, checkboxes, radio buttons
  - Embedded grids and text blocks in the panel
  - Programmatically opening a grid or text block in a central editor tab
  - Progress bars
- Integrated **interactive grid viewer** that can open JSON or CSV files as a powerful filterable, sortable grid (from button or API)

## Documentation
[Contents](documentation/documentation.md)

## How to use

1. Open a `.js`, `.ts`, or `.py` file in VS Code.
2. Open the **"Script UI"** panel (located in the bottom panel).
3. Click the **"Run"** button in the header of the **"Script UI"** panel to execute the active file.
4. If your script uses [`interactive-script-js`](https://www.npmjs.com/package/interactive-script-js) (JavaScript/TypeScript) or [`interactive-script-py`](https://pypi.org/project/interactive-script-py/) (Python), it can send messages to the panel and receive input from the user through the `ui` object.

#### JavaScript / TypeScript Example:

```ts
import ui from "interactive-script-js";

async function demo() {
    ui.log("Hello from interactive script!");
    const pressedButton = await ui.dialog.confirm("Do you like this extension?");
    if (pressedButton === "Yes") {
        ui.success("Great! 🎉");
    } else {
        ui.warn("Maybe next time.");
    }
}

demo();
```

#### Python Example:

```python
import asyncio
from interactive_script_py import ui

async def demo():
    ui.log("Hello from Python!")
    pressed = await ui.dialog.confirm("Do you like this extension?")
    if pressed == "Yes":
        ui.success("Awesome!")
    else:
        ui.warn("That's okay!")
        
asyncio.run(demo())
```

The script’s outputs (styled logs, dialogs, grids, etc.) appear inside **"Script UI"**, interacting with the user live.

## Grid Viewer

You can also open JSON or CSV files as an interactive grid in the editor:

- A **button in the top right corner** of VS Code (visible when a JSON or CSV file is active) allows you to open that file in a grid view.
- The grid supports:
  - Column resizing and moving
  - Sorting
  - Column filtering with multi-select
  - Range selection (Excel-style) with **copy-paste to Excel**
  - Export/copy options: `Copy as JSON`, `Copy as CSV`, `Copy formatted (HTML table for pasting into Word, Outlook, etc.)`

Grids can also be opened programmatically via `ui.window.showGrid(jsonArray)` from within a script.

![Example snippet output](https://raw.githubusercontent.com/andriy-viyatyk/interactive-script/main/images/grid-viewer.png)


## Why use Interactive Script?

- Perfect for creating **internal developer tools** inside VS Code
- Ideal for building **interactive scripts** that guide users through data selection, queries, and workflows
- Lets you build **custom UI-driven flows** (dialogs, grids, inputs) without needing to create a full VS Code extension or web app


## Demo scripts

Example demo scripts are available in the [GitHub repository](https://github.com/andriy-viyatyk/interactive-script):

- `demo/` – contains JavaScript/TypeScript example scripts using [`interactive-script-js`](https://www.npmjs.com/package/interactive-script-js)
- `python_demo/` – contains Python example scripts using [`interactive-script-py`](https://pypi.org/project/interactive-script-py/)

#### Try the JavaScript/TypeScript demos:

1. Open the `demo` folder in a terminal.
2. Run `npm install interactive-script-js`.
3. Open a `.ts` file in VS Code, open the **"Script UI"** panel, and click **"Run"**.

#### Try the Python demos:

1. Open the `python_demo` folder in a terminal.
2. Create a virtual environment (optional).
3. Run `pip install interactive-script-py`.
4. Open a `.py` file in VS Code, open the **"Script UI"** panel, and click **"Run"**.

> These demo scripts are useful for testing or exploring how to build interactive scripts using the `interactive-script-js` library.


Example snippet from the demo:

```
ui.log([{ text: "Interactive Script Demo", styles: { fontSize: 18, color: 'cyan' } }]);
ui.show.gridFromJsonArray([
    { name: "Item 1", value: 1 },
    { name: "Item 2", value: 2 }
]);
await ui.dialog.confirm("Do you like it?");
```

Output:

![Example snippet output](https://raw.githubusercontent.com/andriy-viyatyk/interactive-script/main/images/example-snippet.png)


## Using `interactive-script-js`

JavaScript and TypeScript scripts must import [`interactive-script-js`](https://www.npmjs.com/package/interactive-script-js) to communicate with the extension’s UI.


APIs include:

- **Logging & Output**
  - `ui.log()`, `ui.error()`, `ui.warn()`, `ui.info()`, `ui.success()`, `ui.text()`
  - `ui.clear()`
  - `ui.output.append()`, `ui.output.clear()`

- **Dialogs**
  - `ui.dialog.buttons()`
  - `ui.dialog.confirm()`
  - `ui.dialog.textInput()`
  - `ui.dialog.dateInput()`
  - `ui.dialog.checkboxes()`
  - `ui.dialog.radioboxes()`
  - `ui.dialog.selectRecord()`

- **Inline Components**
  - `ui.input.select)()`
  - `ui.inline.confirm()`
  - `ui.inline.textInput()`
  - `ui.inline.dateInput()`

- **Output Components**
  - `ui.show.gridFromJsonArray()`
  - `ui.show.textBlock()`
  - `ui.show.progress()`

- **Window Components**
  - `ui.window.showGrid()`
  - `ui.window.showText()`

- **Event Subscriptions**
  - `ui.on.consoleLog(callback)`
  - `ui.on.consoleError(callback)`


## Using `interactive-script-py`

Python scripts must install and import [`interactive-script-py`](https://pypi.org/project/interactive-script-py/).

APIs are similar to the JavaScript version, including:

- **Logging & Output**
  - `ui.log()`, `ui.error()`, `ui.warn()`, `ui.info()`, `ui.success()`, `ui.text()`
  - `ui.clear()`
  - `ui.output.append()`, `ui.output.clear()`

- **Dialogs**
  - `ui.dialog.confirm()`
  - `ui.dialog.buttons()`
  - `ui.dialog.checkboxes()`
  - `ui.dialog.radioboxes()`
  - `ui.dialog.date_input()`
  - `ui.dialog.text_input()`
  - `ui.dialog.select_record()`

- **Inline Components**
  - `ui.inline.select()`
  - `ui.inline.confirm`
  - `ui.inline.text_input()`
  - `ui.inline.date_input()`

- **Output Components**
  - `ui.show.grid_from_list()`
  - `ui.show.text_block()`
  - `ui.show.progress()`

- **Window Components**
  - `ui.window.show_grid()`
  - `ui.window.show_text()`

- **Event Subscriptions**
  - `ui.on.console_log(callback)`
  - `ui.on.console_error(callback)`


## Contributing

Pull requests and feedback are welcome! Please file issues or feature requests via [GitHub Issues](https://github.com/andriy-viyatyk/interactive-script).


## License

ISC

