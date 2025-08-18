# Interactive Script

**Interactive Script** is a Visual Studio Code extension that lets you run Node.js, Python **and now PowerShell** scripts interactively inside VS Code, using a dedicated **"Script UI"** panel. Your scripts can dynamically output styled text, interactive dialogs, grids, progress indicators, and more — all rendered inside the editor, without leaving VS Code.

[![Demo Video](https://raw.githubusercontent.com/andriy-viyatyk/interactive-script/main/images/demo.gif)](https://github.com/andriy-viyatyk/interactive-script)


⚠️ **Important Compatibility Warning** ⚠️

"Interactive Script" relies on external client libraries (`interactive-script-js` for JavaScript/TypeScript and `interactive-script-py` for Python) to enable interactive features.

**It is crucial that the version of your installed client library is compatible with your "Interactive Script" VS Code extension version.**

VS Code extensions update automatically, but client libraries must be updated manually (`npm update` or `pip install --upgrade`). **Incompatible versions may lead to unexpected behavior or breaking changes.**

Please refer to the [**Version Compatibility Guide**](documentation/compatibility.md) for detailed information on matching extension and client library versions. We strongly recommend keeping your client libraries up-to-date with the extension.

## Key Features

- Adds a **"Script UI"** view in the bottom panel of VS Code
- Shows a **"Run"** button when a `.js`, `.ts`, `.py`, or `.ps1` file is active, to execute the script
- Spawns a Node.js, ts-node, Python, or PowerShell process, streaming `stdout` and `stdin` to/from the **Script UI** panel
- Requires the [`interactive-script-js`](https://www.npmjs.com/package/interactive-script-js), [`interactive-script-py`](https://pypi.org/project/interactive-script-py/) library, or the [`interactive-script-ps.ps1`](https://github.com/andriy-viyatyk/interactive-script/blob/main/powershell_demo/interactive-script-ps.ps1) module to build interactive scripts with:
  - Styled log output (`ui.log`, `ui.error`, `ui.warn`, `ui.success`, etc.)
  - Interactive dialogs: buttons, confirms, text inputs, checkboxes, radio buttons
  - Embedded grids and text blocks in the panel
  - Programmatically opening a grid or text block in a central editor tab
  - Progress bars
- Integrated **grid editor** for direct editing of JSON or CSV files, offering powerful filtering and sorting capabilities.

## Documentation
[Contents](documentation/documentation.md)

## How to use

1. Open a `.js`, `.ts`, `.py`, or `.ps1` file in VS Code.
2. Open the **"Script UI"** panel (located in the bottom panel).
3. Click the **"Run"** button in the header of the **"Script UI"** panel to execute the active file.
4. If your script uses [`interactive-script-js`](https://www.npmjs.com/package/interactive-script-js) (JavaScript/TypeScript), [`interactive-script-py`](https://pypi.org/project/interactive-script-py/) (Python), or [`interactive-script-ps.ps1`](https://github.com/andriy-viyatyk/interactive-script/blob/main/powershell_demo/interactive-script-ps.ps1) (PowerShell), it can send messages to the panel and receive input from the user through the `ui` object.


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

#### PowerShell Example:

```
. 'powershell_demo/interactive-script-ps.ps1'

$ui.Log("Hello from PowerShell!")
$pressed = $ui.dialog_confirm("Do you like this extension?")
if ($pressed -eq "Yes") {
    $ui.Success("Awesome! 🎉")
} else {
    $ui.Warn("That's okay!")
}
```

The script’s outputs (styled logs, dialogs, grids, etc.) appear inside **"Script UI"**, interacting with the user live.

## Grid Editor

The extension provides a dedicated [Grid Editor](documentation/grid.md) for JSON and CSV files, enabling you to view, modify, and manage your data directly within VS Code. You can open files with the Grid Editor in several ways:

- A **button in the top right corner** of VS Code (visible when a JSON or CSV file is active) allows you to open that file in a grid editor.
- Programmatically via `ui.window.showGrid(jsonArray)` from within a script.

### The grid supports:

- Column resizing and moving
- Sorting
- Column filtering with multi-select
- Full editing capabilities (cell editing, row insertion/deletion), column resizing and moving, sorting, column filtering with multi-select, and Excel-style range selection with robust copy-paste to and from Excel/other spreadsheet applications.
- Smart Data Handling: Automatically detects data types (string, number, boolean) for JSON properties and enforces validation during editing and pasting.
- Seamless Integration: Built on VS Code's native text file capabilities, ensuring real-time synchronization with external edits and full support for VS Code's built-in Undo/Redo functionality (for data changes).
- Export/copy options: `Copy as JSON`, `Copy as CSV`, `Copy formatted (HTML table for pasting into Word, Outlook, etc.)`.

![Example snippet output](https://raw.githubusercontent.com/andriy-viyatyk/interactive-script/main/images/grid-viewer.png)


## Why use Interactive Script?

- Perfect for creating **internal developer tools** inside VS Code
- Ideal for building **interactive scripts** that guide users through data selection, queries, and workflows
- Lets you build **custom UI-driven flows** (dialogs, grids, inputs) without needing to create a full VS Code extension or web app


## Demo scripts

Example demo scripts are available in the [GitHub repository](https://github.com/andriy-viyatyk/interactive-script):

- `demo/` – contains JavaScript/TypeScript example scripts using [`interactive-script-js`](https://www.npmjs.com/package/interactive-script-js)
- `python_demo/` – contains Python example scripts using [`interactive-script-py`](https://pypi.org/project/interactive-script-py/)
- `powershell_demo/` – contains PowerShell example scripts using [`interactive-script-ps.ps1`](https://github.com/andriy-viyatyk/interactive-script/blob/main/powershell_demo/interactive-script-ps.ps1)

#### Try the JavaScript/TypeScript demos:

1. Open the `demo` folder in a terminal.
2. Run `npm install interactive-script-js`.
3. Open a `.ts` file in VS Code, open the **"Script UI"** panel, and click **"Run"**.

#### Try the Python demos:

1. Open the `python_demo` folder in a terminal.
2. Create a virtual environment (optional).
3. Run `pip install interactive-script-py`.
4. Open a `.py` file in VS Code, open the **"Script UI"** panel, and click **"Run"**.

#### Try the PowerShell demos:

1. Open the `powershell_demo` folder in a terminal.

2. No installation is required; the `interactive-script-ps.ps1` module is available directly in the `powershell_demo` folder.

3. Open a `.ps1` file in VS Code, open the **"Script UI"** panel, and click **"Run"**.

> These demo scripts are useful for testing or exploring how to build interactive scripts using the `interactive-script-js`, `interactive-script-py`, or `interactive-script-ps.ps1` library/module.

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
  - [`ui.log()`](documentation/api.md#uilog), [`ui.error()`](documentation/api.md#uierror), [`ui.warn()`](documentation/api.md#uiwarn), [`ui.info()`](documentation/api.md#uiinfo), [`ui.success()`](documentation/api.md#uisuccess), [`ui.text()`](documentation/api.md#uitext)
  - [`ui.clear()`](documentation/api.md#uiclear)
  - [`ui.output.append()`](documentation/api.md#uioutputappend), [`ui.output.clear()`](documentation/api.md#uioutputclear)

- **Dialogs**
  - [`ui.dialog.buttons()`](documentation/api.md#uidialogbuttons)
  - [`ui.dialog.confirm()`](documentation/api.md#uidialogconfirm)
  - [`ui.dialog.textInput()`](documentation/api.md#uidialogtextinput)
  - [`ui.dialog.dateInput()`](documentation/api.md#uidialogdateinput)
  - [`ui.dialog.checkboxes()`](documentation/api.md#uidialogcheckboxes)
  - [`ui.dialog.radioboxes()`](documentation/api.md#uidialogradioboxes)
  - [`ui.dialog.selectRecord()`](documentation/api.md#uidialogselectrecord)
  - [`ui.dialog.gridInput()`](documentation/api.md#uidialoggridinput)

- **Inline Components**
  - [`ui.inline.select()`](documentation/api.md#uiinlineselect)
  - [`ui.inline.confirm()`](documentation/api.md#uiinlineconfirm)
  - [`ui.inline.textInput()`](documentation/api.md#uiinlinetextinput)
  - [`ui.inline.dateInput()`](documentation/api.md#uiinlinedateinput)

- **Output Components**
  - [`ui.show.gridFromJsonArray()`](documentation/api.md#uishowgridfromjsonarray)
  - [`ui.show.textBlock()`](documentation/api.md#uishowtextblock)
  - [`ui.show.progress()`](documentation/api.md#uishowprogress)

- **Window Components**
  - [`ui.window.showGrid()`](documentation/api.md#uiwindowshowgrid)
  - [`ui.window.showText()`](documentation/api.md#uiwindowshowtext)

- **File Components**
  - [`ui.file.open()`](documentation/api.md#uifileopen)
  - [`ui.file.openFolder()`](documentation/api.md#uifileopenfolder)
  - [`ui.file.save()`](documentation/api.md#uifilesave)
  - [`ui.file.showOpen`](documentation/api.md#uifileshowopen)
  - [`ui.file.showOpenFolder()`](documentation/api.md#uifileshowopenfolder)
  - [`ui.file.showSave()`](documentation/api.md#uifileshowsave)

- **Event Subscriptions**
  - [`ui.on.consoleLog(callback)`](documentation/api.md#uionconsolelogcallback)
  - [`ui.on.consoleError(callback)`](documentation/api.md#uionconsoleerrorcallback)


## Using `interactive-script-py`

Python scripts must install and import [`interactive-script-py`](https://pypi.org/project/interactive-script-py/).

APIs are similar to the JavaScript version, including:

- **Logging & Output**
  - [`ui.log()`](documentation/api.md#uilog), [`ui.error()`](documentation/api.md#uierror), [`ui.warn()`](documentation/api.md#uiwarn), [`ui.info()`](documentation/api.md#uiinfo), [`ui.success()`](documentation/api.md#uisuccess), [`ui.text()`](documentation/api.md#uitext)
  - [`ui.clear()`](documentation/api.md#uiclear)
  - [`ui.output.append()`](documentation/api.md#uioutputappend), [`ui.output.clear()`](documentation/api.md#uioutputclear)

- **Dialogs**
  - [`ui.dialog.confirm()`](documentation/api.md#uidialogconfirm)
  - [`ui.dialog.buttons()`](documentation/api.md#uidialogbuttons)
  - [`ui.dialog.checkboxes()`](documentation/api.md#uidialogcheckboxes)
  - [`ui.dialog.radioboxes()`](documentation/api.md#uidialogradioboxes)
  - [`ui.dialog.date_input()`](documentation/api.md#uidialogdateinput)
  - [`ui.dialog.text_input()`](documentation/api.md#uidialogtextinput)
  - [`ui.dialog.select_record()`](documentation/api.md#uidialogselectrecord)
  - [`ui.dialog.grid_input()`](documentation/api.md#uidialoggridinput)

- **Inline Components**
  - [`ui.inline.select()`](documentation/api.md#uiinlineselect)
  - [`ui.inline.confirm()`](documentation/api.md#uiinlineconfirm)
  - [`ui.inline.text_input()`](documentation/api.md#uiinlinetextinput)
  - [`ui.inline.date_input()`](documentation/api.md#uiinlinedateinput)

- **Output Components**
  - [`ui.show.grid_from_list()`](documentation/api.md#uishowgridfromjsonarray)
  - [`ui.show.text_block()`](documentation/api.md#uishowtextblock)
  - [`ui.show.progress()`](documentation/api.md#uishowprogress)

- **Window Components**
  - [`ui.window.show_grid()`](documentation/api.md#uiwindowshowgrid)
  - [`ui.window.show_text()`](documentation/api.md#uiwindowshowtext)

- **File Components**
  - [`ui.file.open()`](documentation/api.md#uifileopen)
  - [`ui.file.open_folder()`](documentation/api.md#uifileopenfolder)
  - [`ui.file.save()`](documentation/api.md#uifilesave)
  - [`ui.file.show_open()`](documentation/api.md#uifileshowopen)
  - [`ui.file.show_open_folder()`](documentation/api.md#uifileshowopenfolder)
  - [`ui.file.show_save()`](documentation/api.md#uifileshowsave)

- **Event Subscriptions**
  - [`ui.on.console_log(callback)`](documentation/api.md#uionconsolelogcallback)
  - [`ui.on.console_error(callback)`](documentation/api.md#uionconsoleerrorcallback)


## Using `interactive-script-ps`

PowerShell scripts must dot-source the [`interactive-script-ps.ps1`](https://github.com/andriy-viyatyk/interactive-script/blob/main/powershell_demo/interactive-script-ps.ps1) module to communicate with the extension’s UI.

APIs are similar to the JavaScript and Python versions, including:

- **Logging & Output**
  - [`ui.Log()`](powershell_demo/components/text.ps1), ['ui.Error()'](powershell_demo/components/text.ps1), [`ui.Warn()`](powershell_demo/components/text.ps1), [`ui.Info()`](powershell_demo/components/text.ps1), [`ui.Success()`](powershell_demo/components/text.ps1), [`ui.Text()`](powershell_demo/components/text.ps1)

- **Dialogs**
  - [`ui.dialog_confirm()`](powershell_demo/components/dialog_confirm.ps1)
  - [`ui.dialog_buttons()`](powershell_demo/components/dialog_buttons.ps1)
  - [`ui.dialog_checkboxes()`](powershell_demo/components/dialog_checkboxes.ps1)
  - [`ui.dialog_radioboxes()`](powershell_demo/components/dialog_radioboxes.ps1)
  - [`ui.dialog_dateInput()`](powershell_demo/components/dialog_dateInput.ps1)
  - [`ui.dialog_textInput()`](powershell_demo/components/dialog_textInput.ps1)
  - [`ui.dialog_select_record()`](powershell_demo/components/dialog_select_record.ps1)
  - [`ui.dialog_gridInput()`](powershell_demo/components/dialog_gridInput.ps1)

- **Inline Components**
  - [`ui.inline_select()`](powershell_demo/components/inline_select.ps1)
  - [`ui.inline_confirm()`](powershell_demo/components/inline_confirm.ps1)
  - [`ui.inline_textInput()`](powershell_demo/components/inline_textInput.ps1)
  - [`ui.inline_dateInput()`](powershell_demo/components/inline_dateInput.ps1)

- **Output Components**
  - [`ui.show_grid()`](powershell_demo/components/show_grid.ps1)
  - [`ui.show_text()`](powershell_demo/components/show_text.ps1)
  - [`ui.show_progress()`](powershell_demo/components/show_progress.ps1)

- **Window Components**
  - [`ui.window_show_grid()`](powershell_demo/components/window_show_grid.ps1)
  - [`ui.window_show_text()`](powershell_demo/components/window_show_text.ps1)

- **File Components**
  - [`ui.file_open()`](powershell_demo/components/file_open.ps1)
  - [`ui.file_openFolder()`](powershell_demo/components/file_openFolder.ps1)
  - [`ui.file_save()`](powershell_demo/components/file_save.ps1)
  - [`ui.file_showOpen()`](powershell_demo/components/file_showOpen.ps1)
  - [`ui.file_showOpenFolder()`](powershell_demo/components/file_showOpenFolder.ps1)
  - [`ui.file_showSave()`](powershell_demo/components/file_showSave.ps1)

## Contributing

Pull requests and feedback are welcome! Please file issues or feature requests via [GitHub Issues](https://github.com/andriy-viyatyk/interactive-script).


## License

ISC

