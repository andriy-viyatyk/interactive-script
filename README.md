
# 🎬 Interactive Script

**Interactive Script** is a Visual Studio Code extension that lets you run Node.js scripts interactively inside VS Code, using a dedicated **"Script UI"** panel. Your scripts can dynamically output styled text, interactive dialogs, grids, progress indicators, and more — all rendered inside the editor, without leaving VS Code.

[![Demo Video](https://raw.githubusercontent.com/andriy-viyatyk/interactive-script/main/images/demo.gif)

---

## ✨ Key Features

- 🚀 Adds a **"Script UI"** view in the bottom panel of VS Code
- ▶️ Shows a **"Run"** button when a `.js` or `.ts` file is active, to execute the script
- 🖥️ Spawns a Node.js or ts-node process, streaming `stdout` and `stdin` to/from the **Script UI** panel
- 🧩 Requires the [`interactive-script-js`](https://www.npmjs.com/package/interactive-script-js) library to build interactive scripts with:
  - Styled log output (`ui.log`, `ui.error`, `ui.warn`, `ui.success`, etc.)
  - Interactive dialogs: buttons, confirms, text inputs, checkboxes, radio buttons
  - Embedded grids and text blocks in the panel
  - Programmatically opening a grid or text block in a central editor tab
  - Progress bars
- 📊 Integrated **interactive grid viewer** that can open JSON or CSV files as a powerful filterable, sortable grid (from button or API)

---

### How to use

1. Open a `.js` or `.ts` file in VS Code.
2. Open the **"Script UI"** panel (located in the bottom panel).
3. Click the **"Run"** button in the header of the **"Script UI"** panel to execute the active file.
4. If your script uses the [`interactive-script-js`](https://www.npmjs.com/package/interactive-script-js) library, it can send messages to the panel and receive input from the user through the `ui` object.

Example:

```
import ui from "interactive-script-js";

ui.log("Hello from interactive script!");
const pressedButton = await ui.dialog.confirm("Do you like this extension?");
if (pressedButton === "Yes") {
    ui.success("Great! 🎉");
} else {
    ui.warn("Maybe next time.");
}
```

✅ The script’s outputs (styled logs, dialogs, grids, etc.) appear inside **"Script UI"**, interacting with the user live.

---

## 🖥️ Grid Viewer

You can also open JSON or CSV files as an interactive grid in the editor:

- 📁 A **button in the top right corner** of VS Code (visible when a JSON or CSV file is active) allows you to open that file in a grid view.
- 📊 The grid supports:
  - Column resizing and moving
  - Sorting
  - Column filtering with multi-select
  - Range selection (Excel-style) with **copy-paste to Excel**
  - Export/copy options: `Copy as JSON`, `Copy as CSV`, `Copy formatted (HTML table for pasting into Word, Outlook, etc.)`

Grids can also be opened programmatically via `ui.window.showGrid(jsonArray)` from within a script.

![Example snippet output](https://raw.githubusercontent.com/andriy-viyatyk/interactive-script/main/images/grid-viewer.png)

---

### Why use Interactive Script?

- ✅ Perfect for creating **internal developer tools** inside VS Code
- ✅ Ideal for building **interactive scripts** that guide users through data selection, queries, and workflows
- ✅ Lets you build **custom UI-driven flows** (dialogs, grids, inputs) without needing to create a full VS Code extension or web app
- ⚠️ Not intended for rendering rich text documents — behaves more like an **interactive terminal** with UI components rather than a formatted document viewer

---

### Demo scripts

Example demo scripts are available in the [GitHub repository](https://github.com/andriy-viyatyk/interactive-script) inside the `demo` folder. These scripts demonstrate various features and UI components.

To try them:

1. Clone or download the repository.
2. Open the `demo` folder in a terminal.
3. Run `npm install interactive-script-js` to install the required dependency.
4. Open one of the demo `.ts` files in VS Code.
5. Open the **"Script UI"** panel.
6. Click **"Run"** in the panel header.
7. Follow the interactive steps displayed in the panel.

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

---

## 📚 Using \`interactive-script-js\`

Your scripts must import [`interactive-script-js`](https://www.npmjs.com/package/interactive-script-js) to communicate with the extension’s UI.

Available APIs:

- \`ui.log()\`, \`ui.error()\`, \`ui.warn()\`, \`ui.info()\`, \`ui.success()\`
- \`ui.dialog.confirm()\`, \`ui.dialog.textInput()\`, \`ui.dialog.buttons()\`
- \`ui.show.gridFromJsonArray()\`, \`ui.show.textBlock()\`
- \`ui.window.showGrid()\`, \`ui.window.showText()\`
- and more!

See the demo script for examples.

---

## 💻 Contributing

Pull requests and feedback are welcome! Please file issues or feature requests via [GitHub Issues](https://github.com/andriy-viyatyk/interactive-script).

---

## 📄 License

ISC

---

