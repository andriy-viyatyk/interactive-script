# Grid Editor

The integrated "**Grid Editor**" is a custom VS Code editor that provides a user-friendly, spreadsheet-like interface for viewing and editing structured data files. It's designed to make it easy to work with tabular data stored in JSON or CSV formats.

## How to Use

The Grid Editor is automatically registered for files with the extensions `.grid.json` and `.grid.csv`. You can also open any JSON or CSV file by clicking a button in the top right corner of VS Code (visible when a JSON or CSV file is active) 

### Key Features

* **Intelligent Data Handling:** When you open a JSON file, the editor analyzes the objects in the JSON array to automatically detect the data types of each property (string, number, or boolean). It then creates a column for each property with the corresponding data type.

* **Data Validation:** The editor enforces data types. When you edit a cell or paste data, it will validate the input. For number and boolean columns, it will only accept valid values. Invalid inputs will result in the property being removed from the object (for JSON) or the cell value being cleared.

* **Live Updates:** Since the Grid Editor is built on top of VS Code's native `TextFile` functionality, it stays synchronized with the underlying file. Any changes made to the file in a separate text editor or via another extension will be automatically reflected in the grid.

* **Built-in Undo/Redo:** The editor inherits VS Code's default undo (`Ctrl + Z`) and redo (`Ctrl + Shift + Z` or `Ctrl + Y`) functionality, allowing you to easily revert changes.

* **Editing Boolean Columns:** Cells in boolean columns do not enter a separate edit mode. Their value is represented by a visual state: a check icon for `true` and a blank space for `false` or `null`/`undefined`. When you hover over a boolean cell, a checkbox appears, allowing you to instantly change the value with a single click without entering edit mode. The checkbox is centered in the cell, so you can still click near it to select the cell itself.
In addition, the following keyboard shortcuts are available when one or more boolean cells are selected:
    - `Space`: Applies a `NOT` operation to each selected cell. `true` values become `false`, and `false` values become `true`.
    - `Enter`: Applies a `NOT` operation only to the focused cell within the selection. The resulting value (e.g., if the focused cell was `true`, the new value is `false`) is then copied to all other selected cells.

### Keyboard Shortcuts

The Grid Editor supports a comprehensive set of keyboard shortcuts for efficient navigation, editing, and data manipulation, similar to those found in popular spreadsheet applications.

| Hotkey Combination | Action |
| :--- | :--- |
| `F2`, `Enter`, `<text typing>` | Enter cell edit mode |
| `Esc` | Exit cell edit mode |
| `Enter` | Confirms edit and exits edit mode |
| `Arrow Keys` | Move cell focus by one cell (Up, Down, Left, Right). Hold `Shift` to extend the selection. |
| `Ctrl + Left/Right` | Jump to the first or last cell in the current row. Hold `Shift` to extend the selection. |
| `Ctrl + Up/Down` | Jump up or down by one page (visible rows). Hold `Shift` to extend the selection. |
| `Page Up`, `Page Down` | Move cell focus by a page (visible rows) up or down. Hold `Shift` to extend the selection. |
| `Home`, `End` | Move focus to the first or last row. Hold `Shift` to extend the selection. |
| `Ctrl + Home` | Move focus to the first cell of the entire grid. Hold `Shift` to extend the selection. |
| `Ctrl + End` | Move focus to the last cell of the entire grid. Hold `Shift` to extend the selection. |
| `Tab` | Move focus to the next cell; wraps to the next row |
| `Shift + Tab` | Move focus to the previous cell; wraps to the previous row |
| `Shift + Mouse Click` | Select a range of cells from the focused cell to the clicked cell |
| `Delete` | Clear the data in all selected cells |
| `Ctrl + Insert` | Insert a new row at the current focused position, insert multiple rows if multiple rows are selected |
| `Ctrl + Delete` | Delete all selected rows |
| `Ctrl + C` | Copy the contents of selected cells to the clipboard |
| `Ctrl + V` | Paste clipboard content into the focused cell(s) |
| `Ctrl + A` | Select all cells in the grid |

## Copy and Paste Functionality

The Grid Editor's copy and paste functionality is designed for seamless data transfer, both within the editor and to external applications like spreadsheets.

### Copy (`Ctrl + C`)

The data copied to the clipboard depends on your selection:
* **Single Cell Selection:** The raw value of the selected cell is copied to the clipboard.
* **Range Selection:** The entire selected range is copied in a CSV format, with a tab delimiter. This format is highly compatible with applications like Microsoft Excel, allowing you to easily paste data directly into a spreadsheet.

### Paste (`Ctrl + V`)

When you paste, the editor parses the clipboard content using a CSV parser with a tab delimiter, effectively creating a table of data to be pasted with n rows and m columns. The paste behavior then adjusts based on your grid selection:
* **Single Cell is Selected:** The paste range is automatically adjusted to match the size of the data being pasted. Columns are extended as needed up to the last available column in the grid. If the pasted data has more columns than the grid, the extra columns are ignored. Rows are fully extended to accommodate the pasted data, and new rows are automatically inserted at the bottom if necessary.
* **A Range of Cells is Selected:** The pasted data will be applied to the selected range. If the pasted data is larger than the selection, any extra rows or columns from the pasted data are ignored. If the pasted data is smaller than the selection, the data will be filled into the selected range like tiles, from left to right and top to bottom. This tiling behavior allows you to quickly fill a large selection with a single value or a repeating pattern of values. For example, if you copy a single value and then select a range of cells and paste, that single value will be copied into every cell in the selected range.

## A Note on Undo/Redo

The Grid Editor inherits VS Code's native undo/redo functionality, which operates directly on the underlying JSON or CSV file. This means only data changes are tracked and can be undone or redone.

Please keep in mind that the editor itself does not have a separate undo history for its UI state. Therefore, actions like applying a filter, changing sorting, or adjusting your cell selection will not be undone or redone when you press Ctrl + Z or Ctrl + Y. While we may explore adding this functionality in future releases, you should be aware of this limitation when working with the editor.