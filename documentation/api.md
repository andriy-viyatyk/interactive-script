<div style="text-align: right;">
    <a href="documentation.md">Back to Documentation Home</a>
</div>

---


# API Reference

This document provides a detailed reference for all available functions and components within the `ui` object, enabling you to build interactive scripts.

## Table of Contents

### Logging & Output
* [`ui.log()`](#uilog)
* [`ui.error()`](#uierror)
* [`ui.warn()`](#uiwarn)
* [`ui.info()`](#uiinfo)
* [`ui.success()`](#uisuccess)
* [`ui.text()`](#uitext)
* [`ui.clear()`](#uiclear)
* [`ui.output.append()`](#uioutputappend)
* [`ui.output.clear()`](#uioutputclear)

### Dialogs
* [`ui.dialog.buttons()`](#uidialogbuttons)
* [`ui.dialog.confirm()`](#uidialogconfirm)
* [`ui.dialog.textInput()`](#uidialogtextinput)
* [`ui.dialog.dateInput()`](#uidialogdateinput)
* [`ui.dialog.checkboxes()`](#uidialogcheckboxes)
* [`ui.dialog.radioboxes()`](#uidialogradioboxes)
* [`ui.dialog.selectRecord()`](#uidialogselectrecord)

### Inline Components
* [`ui.inline.select()`](#uiinlineselect)
* [`ui.inline.confirm()`](#uiinlineconfirm)
* [`ui.inline.textInput()`](#uiinlinetextinput)
* [`ui.inline.dateInput()`](#uiinlinedateinput)

### Output Components
* [`ui.show.gridFromJsonArray()`](#uishowgridfromjsonarray)
* [`ui.show.textBlock()`](#uishowtextblock)
* [`ui.show.progress()`](#uishowprogress)

### Window Components
* [`ui.window.showGrid()`](#uiwindowshowgrid)
* [`ui.window.showText()`](#uiwindowshowtext)

### Event Subscriptions
* [`ui.on.consoleLog(callback)`](#uionconsolelogcallback)
* [`ui.on.consoleError(callback)`](#uionconsoleerrorcallback)

### Styled Text
* [`styledText()`](#styledtext-function)

---

## API Definitions

### Logging & Output

#### `ui.log()`, `ui.error()`, `ui.warn()`, `ui.info()`, `ui.success()`, `ui.text()` <a id="uilog"></a> <a id="uierror"></a> <a id="uiwarn"></a> <a id="uiinfo"></a> <a id="uisuccess"></a> <a id="uitext"></a>

These methods are used to print messages to the "Script UI" panel. They all return a `StyledLogCommand` object, allowing for method chaining to apply various styling options to the text before printing. The primary difference between these methods is their default text color, indicating the message's severity or type:

* **`ui.text()`**: Prints text with a high-contrast color (near-white in dark themes, near-black in light themes).
* **`ui.log()`**: Prints standard log messages with a less contrast color (e.g., silver or gray in dark mode).
* **`ui.error()`**: Prints error messages in `red`.
* **`ui.warn()`**: Prints warning messages in `orange`.
* **`ui.info()`**: Prints informational messages in `blue`.
* **`ui.success()`**: Prints success messages in `green`.

These methods support simple strings, or complex `UiText` arrays for multi-part styled messages. To finalize the output and display it in the UI panel, you must call the `.print()` method at the end of the chain.

**Styling Capabilities:**
The returned `StyledLogCommand` object (which extends `StyledText`) provides the following methods for rich text formatting:

* `.color(color: StyledTextColor)`: Sets the text color.
* `.background(color: StyledTextColor)`: Sets the background color of the text. Adds slight padding and border-radius.
* `.border(color: StyledTextColor)`: Adds a border around the text. Adds slight padding and border-radius.
* `.fontSize(size: string | number)`: Sets the font size (e.g., `16`, `"1.2em"`).
* `.underline()`: Underlines the text.
* `.italic()`: Makes the text italic.
* `.bold()`: Makes the text bold.
* `.then(text?: string)`: Appends additional text to the current output, allowing for different styles to be applied to subsequent parts of a single line.
* `.style(styles: Styles)`: Applies custom CSS styles as an object. This can be used for properties like `textTransform: "uppercase"`, `letterSpacing: "2px"`, `textDecoration: "line-through"`, etc.

**Usage Examples:**

For comprehensive examples demonstrating the usage of `ui.log()`, `ui.error()`, `ui.warn()`, `ui.info()`, `ui.success()`, and `ui.text()` along with their styling capabilities, please refer to the [Styled Text Demo Script](../demo/features/styledText.ts).

#### `ui.clear()` <a id="uiclear"></a>

ui.clear() is a simple utility function that clears all content from the "Script UI" panel. This is useful for resetting the display before presenting new output or when the script's previous output is no longer relevant.

#### `ui.output.append()` <a id="uioutputappend"></a>

The `ui.output.append()` method is used to append a string `message` to the dedicated "Script UI" channel within the standard VS Code "OUTPUT" tab. Unlike the `ui.log()` family of functions which render rich content in the custom "Script UI" panel, this method provides a way to output simple text to VS Code's traditional output channels, which is useful for raw logging or integration with other VS Code features that monitor output.

**Parameters:**

* `message: string`: The string content to append to the output channel.


#### `ui.output.clear()` <a id="uioutputclear"></a>

The `ui.output.clear()` method clears all content from the "Script UI" channel within the VS Code "OUTPUT" tab. This is useful for ensuring a clean slate for new output, especially when running a script multiple times or when the previous output is no longer relevant.

### Dialogs

#### `ui.dialog.buttons(buttons: UiText[] | ButtonsData)` <a id="uidialogbuttons"></a>

The `ui.dialog.buttons()` method displays a dialog with a set of clickable buttons to the user. It pauses script execution until the user selects a button. This is ideal for scenarios where you need the user to choose from a predefined list of options.

The method accepts two main forms of input:

1.  **An array of `UiText`**: A simple array of strings or `UiText` objects (which can be created using `styledText()`) where each element represents a button's label.
2.  **A `ButtonsData` object**: This provides more control, allowing you to define `buttons` as an array of `UiText` and optionally apply custom `bodyStyles` (CSS styles) to the container holding the buttons, which can be useful for arranging many buttons (e.g., in a grid).

**Parameters:**

* `buttons: UiText[] | ButtonsData`
    * If `UiText[]`: An array of strings or styled text objects (created with `styledText().value`) to be displayed as button labels. If an empty array is provided, a default "Proceed" button will be displayed.
    * If `ButtonsData`: An object with the following properties:
        * `buttons: UiText[]`: The array of button labels.
        * `bodyStyles?: Styles`: Optional CSS styles to apply to the dialog's body, which contains the buttons. This is useful for layout adjustments (e.g., `display: "grid"` for a multi-column layout).

**Returns:**

* `Promise<string | undefined>`: A promise that resolves with the `string` value of the pressed button's label. If the dialog is dismissed or an error occurs, it resolves with `undefined`.

**Usage Examples:**

For comprehensive examples demonstrating the usage of `ui.dialog.buttons()`, including simple buttons, styled buttons, and layout with `bodyStyles`, please refer to the [Buttons Demo Script](../demo/components/ui.dialog.buttons.ts).

#### `ui.dialog.confirm(params: UiText | ConfirmData)` <a id="uidialogconfirm"></a>

The `ui.dialog.confirm()` method displays a modal confirmation dialog to the user, typically with "No" and "Yes" or similar action buttons. It pauses script execution until the user interacts with the dialog by clicking one of the provided buttons. This is used when your script needs a definitive "yes" or "no" (or equivalent) response from the user before proceeding.

The method accepts two main forms of input:

1.  **A `UiText` message**: A simple string or a `UiText` object (created using `styledText().value`) which serves as the primary message displayed in the dialog. In this case, the dialog will present default "No" and "Yes" buttons.
2.  **A `ConfirmData` object**: This provides more granular control over the dialog's appearance and behavior.

**Parameters:**

* `params: UiText | ConfirmData`
    * If `UiText`: The main message to display in the confirmation dialog. Default "No" and "Yes" buttons will be provided.
    * If `ConfirmData`: An object with the following properties:
        * `message: UiText`: The main message content of the dialog. This can be a simple string or styled text.
        * `title?: UiText`: Optional. A title to display at the top of the confirmation dialog. This can also be a simple string or styled text.
        * `buttons?: UiText[]`: Optional. An array of strings or `UiText` objects to be displayed as custom action buttons. If not provided, default "No" and "Yes" buttons are used.

**Returns:**

* `Promise<string | undefined>`: A promise that resolves with the `string` value of the button pressed by the user.

**Usage Examples:**
For comprehensive examples demonstrating the usage of `ui.dialog.confirm()`, including basic confirmations, dialogs with titles, and custom styled buttons, please refer to the [Confirm Dialog Demo Script](../demo/components/ui.dialog.confirm.ts).

#### `ui.dialog.textInput(params: UiText | TextInputData)` <a id="uidialogtextinput"></a>

The `ui.dialog.textInput()` method displays a dialog with a text input field, allowing the user to enter a single line or multi-line text. The script execution pauses until the user submits the text or cancels the dialog. This is useful for gathering short textual input from the user.

The method accepts two forms of input:

1.  **A `UiText` title**: A simple string or a `UiText` object (created using `styledText().value`) which serves as the title/prompt for the text input dialog.
2.  **A `TextInputData` object**: This provides more control over the dialog, including custom buttons and an initial text value.

**Parameters:**

* `params: UiText | TextInputData`
    * If `UiText`: The title or prompt to display for the text input.
    * If `TextInputData`: An object with the following properties:
        * `title: UiText`: The title or prompt for the text input dialog. This can be a simple string or styled text.
        * `buttons?: UiText[]`: Optional. An array of strings or `UiText` objects to be displayed as custom action buttons.
            * If not provided, the default button is `!Proceed`.
            * To make a button required (disabled until text is entered), prefix its label with `!`, for example, `"!OK"`. This `!` character is a directive and will not be displayed on the UI button itself, nor will it be part of the `resultButton` value returned.
        * `result?: string`: Optional. An initial string value to pre-populate the text input field.
        * `resultButton?: string`: *Internal Use*. This property is part of the return type and should not be set as an input parameter.

**Returns:**

* `Promise<{ result?: string; resultButton?: string } | undefined>`: A promise that resolves with an object containing:
    * `result?: string`: The text entered by the user.
    * `resultButton?: string`: The label of the button pressed by the user. Note that if a button was specified with a `!` prefix (e.g., `"!OK"`), the `resultButton` will be returned *without* the `!` (e.g., `"OK"`).

**Behavior Notes:**

* **Default Button**: If no `buttons` array is explicitly provided, the dialog will show a single "Proceed" button. For input-enabled dialogs like `textInput()`, this default "Proceed" button behaves as `!Proceed`, meaning it will be disabled until the user enters some text into the input field.
* **Required Buttons (`!` prefix)**: A button prefixed with `!` will remain disabled until the user provides valid input into the dialog's text field. The `!` is a special directive and is stripped from the button's displayed label and its returned `resultButton` value.

**Usage Examples:**
For comprehensive examples demonstrating the usage of `ui.dialog.textInput()`, including basic input, custom buttons (and required buttons), initial text, styled elements, and handling long input, please refer to the [Text Input Demo Script](../demo/components/ui.dialog.textInput.ts).

#### `ui.dialog.dateInput(params?: UiText | DateInputData)` <a id="uidialogdateinput"></a>

The `ui.dialog.dateInput()` method displays an inline interactive component within the "Script UI" panel that allows the user to select a date using a calendar interface. Script execution pauses until the user selects a date and clicks a button to confirm or cancel. This method is useful for gathering date-specific input from the user.

The method accepts an optional `UiText` prompt or a `DateInputData` object for more detailed configuration.

**Parameters:**

* `params?: UiText | DateInputData`
    * If `UiText`: An optional title or prompt for the date input component.
    * If `DateInputData`: An object with the following properties:
        * `title?: UiText`: Optional. A title or prompt to display for the date input. This can be a simple string or styled text (created with `styledText().value`).
        * `buttons?: UiText[]`: Optional. An array of strings or `UiText` objects to be displayed as action buttons.
            * If not provided, the default button is `!Proceed` (disabled until a date is selected).
            * To make a button required (disabled until a date is selected), prefix its label with `!`, for example, `"!OK"`. This `!` character is a directive and will not be displayed on the UI button itself, nor will it be part of the `resultButton` value returned.
        * `result?: Date`: Optional. An initial `Date` object to pre-select in the calendar.

**Returns:**

* `Promise<{ result?: Date; resultButton?: string } | undefined>`: A promise that resolves with an object containing:
    * `result?: Date`: A JavaScript `Date` object representing the date selected by the user.
    * `resultButton?: string`: The label of the button pressed by the user. Note that if a button was specified with a `!` prefix (e.g., `"!OK"`), the `resultButton` will be returned *without* the `!` (e.g., `"OK"`).
    If the component is dismissed (e.g., if the host environment allows external dismissal, though explicitly provided cancel buttons are recommended), it resolves with `undefined`.

**Behavior Notes:**

* **Inline Interaction**: This component is rendered directly within the "Script UI" panel and is not a separate modal pop-up window. It remains active until a button is pressed.
* **No Implicit Dismissal**: There is no built-in dismiss action or `Escape` key handling. To provide a "Cancel" option, you must explicitly include a "Cancel" button in the `buttons` array (without the `!` prefix so it can be clicked without a date selection).
* **Default Button**: If no `buttons` array is explicitly provided, the dialog will show a single "Proceed" button. This default "Proceed" button behaves as `!Proceed`, meaning it will be disabled until the user selects a date.

**Usage Examples:**
For comprehensive examples demonstrating the usage of `ui.dialog.dateInput()`, including basic date selection, custom buttons, and initial date values, please refer to the [Date Input Demo Script](../demo/components/dateInput.ts).

#### `ui.dialog.checkboxes(params: UiText[] | CheckboxesData)` <a id="uidialogcheckboxes"></a>

The `ui.dialog.checkboxes()` method displays an inline interactive component within the "Script UI" panel presenting a list of checkboxes, allowing the user to select zero or more items. Script execution pauses until the user confirms their selection by clicking a button. This is suitable for scenarios where multiple choices from a list are permitted.

The method accepts two main forms of input:

1.  **An array of `UiText`**: A simple array of strings or `UiText` objects where each element represents a checkbox label.
2.  **A `CheckboxesData` object**: This provides more comprehensive control over the checkboxes component, including a title, custom buttons, initial checked states, and styling for the layout.

**Parameters:**

* `params: UiText[] | CheckboxesData`
    * If `UiText[]`: An array of strings or `UiText` objects (created with `styledText().value`) to be displayed as labels for the checkboxes. Each item will be a checkbox.
    * If `CheckboxesData`: An object with the following properties:
        * `items: CheckboxItem[]`: An array of objects, where each `CheckboxItem` represents a single checkbox:
            * `label: UiText`: The text or styled text for the checkbox label.
            * `checked?: boolean`: Optional. If `true`, the checkbox will be pre-selected when displayed. Defaults to `false`.
        * `title?: UiText`: Optional. A title to display above the checkboxes list. This can be a simple string or styled text.
        * `buttons?: UiText[]`: Optional. An array of strings or `UiText` objects to be displayed as action buttons.
            * If not provided, the default button is `!Proceed` (disabled until at least one item is checked).
            * To make a button required (disabled until at least one checkbox is checked), prefix its label with `!`, for example, `"!OK"`. This `!` character is a directive and will not be displayed on the UI button itself, nor will it be part of the `resultButton` value returned.
        * `bodyStyles?: Styles`: Optional. Custom CSS styles to apply to the container holding the checkboxes. Useful for arranging items, e.g., using `display: "grid"` for a multi-column layout.

**Returns:**

* `Promise<{ result?: string[]; resultButton?: string } | undefined>`: A promise that resolves with an object containing:
    * `result?: string[]`: An array of strings, representing the labels of the checkboxes that were selected (checked) by the user.
    * `resultButton?: string`: The label of the button pressed by the user. If a button was specified with a `!` prefix (e.g., `"!OK"`), the `resultButton` will be returned *without* the `!` (e.g., `"OK"`).
    If the component is dismissed (e.g., if the host environment allows external dismissal, though explicitly provided cancel buttons are recommended), it resolves with `undefined`.

**Behavior Notes:**

* **Inline Interaction**: This component is rendered directly within the "Script UI" panel and is not a separate modal pop-up window. It remains active until a button is pressed.
* **No Implicit Dismissal**: There is no built-in dismiss action or `Escape` key handling. To provide a "Cancel" option, you must explicitly include a "Cancel" button in the `buttons` array (without the `!` prefix so it can be clicked without any selection).
* **Default Button**: If no `buttons` array is explicitly provided, the dialog will show a single "Proceed" button. This default "Proceed" button behaves as `!Proceed`, meaning it will be disabled until the user checks at least one item. If the user then unchecks all items, the button will become disabled again.

**Usage Examples:**
For comprehensive examples demonstrating the usage of `ui.dialog.checkboxes()`, including basic lists, custom titles and buttons, initial selections, styled items, and layout options, please refer to the [Checkboxes Demo Script](../demo/components/ui.dialog.checkboxes.ts).

#### `ui.dialog.radioboxes(params: UiText[] | RadioboxesData)` <a id="uidialogradioboxes"></a>

The `ui.dialog.radioboxes()` method displays an inline interactive component within the "Script UI" panel presenting a list of radio buttons, allowing the user to select exactly one item from the provided options. Script execution pauses until the user confirms their selection by clicking a button. This is suitable for scenarios where a single choice from a list is required.

The method accepts two main forms of input:

1.  **An array of `UiText`**: A simple array of strings or `UiText` objects where each element represents a radio button label.
2.  **A `RadioboxesData` object**: This provides more comprehensive control over the radio buttons component, including a title, custom buttons, a default selected item, and styling for the layout.

**Parameters:**

* `params: UiText[] | RadioboxesData`
    * If `UiText[]`: An array of strings or `UiText` objects (created with `styledText().value`) to be displayed as labels for the radio buttons.
    * If `RadioboxesData`: An object with the following properties:
        * `items: UiText[]`: An array of strings or `UiText` objects for the radio button labels.
        * `title?: UiText`: Optional. A title to display above the radio button list. This can be a simple string or styled text.
        * `buttons?: UiText[]`: Optional. An array of strings or `UiText` objects to be displayed as action buttons.
            * If not provided, the default button is `!Proceed` (disabled until an item is selected).
            * To make a button required (disabled until a radio item is selected), prefix its label with `!`, for example, `"!OK"`. This `!` character is a directive and will not be displayed on the UI button itself, nor will it be part of the `resultButton` value returned.
        * `result?: string`: Optional. The string label of the item that should be pre-selected when the component is displayed.
        * `bodyStyles?: Styles`: Optional. Custom CSS styles to apply to the container holding the radio buttons. Useful for arranging items, e.g., using `display: "grid"` for a multi-column layout.

**Returns:**

* `Promise<{ result?: string; resultButton?: string } | undefined>`: A promise that resolves with an object containing:
    * `result?: string`: The label of the radio button that was selected by the user.
    * `resultButton?: string`: The label of the button pressed by the user. If a button was specified with a `!` prefix (e.g., `"!OK"`), the `resultButton` will be returned *without* the `!` (e.g., `"OK"`).
    If the component is dismissed (e.g., if the host environment allows external dismissal, though explicitly provided cancel buttons are recommended), it resolves with `undefined`.

**Behavior Notes:**

* **Inline Interaction**: This component is rendered directly within the "Script UI" panel and is not a separate modal pop-up window. It remains active until a button is pressed.
* **No Implicit Dismissal**: There is no built-in dismiss action or `Escape` key handling. To provide a "Cancel" option, you must explicitly include a "Cancel" button in the `buttons` array (without the `!` prefix so it can be clicked without any selection).
* **Default Button**: If no `buttons` array is explicitly provided, the dialog will show a single "Proceed" button. This default "Proceed" button behaves as `!Proceed`, meaning it will be disabled until the user selects a radio option.

**Usage Examples:**
For comprehensive examples demonstrating the usage of `ui.dialog.radioboxes()`, including basic lists, custom titles and buttons, initial selections, styled items, and layout options, please refer to the [Radioboxes Demo Script](../demo/components/ui.dialog.radioboxes.ts).

#### `ui.dialog.selectRecord(records: any[] | SelectRecordData)` <a id="uidialogselectrecord"></a>

The `ui.dialog.selectRecord()` method displays an inline interactive component within the "Script UI" panel that presents a table-like grid of records, allowing the user to select one or multiple entries. This is particularly useful when your script needs the user to choose from a large dataset. Script execution pauses until the user confirms their selection by clicking a button.

The component is rendered as a bordered dialog with a title, a dynamic grid at the center, and buttons at the bottom. It also includes a search input field in the header for easy filtering of records. The grid offers rich functionality, including sorting, filtering data, and the ability for users to resize and reorder columns directly in the UI.

The method accepts either a simple array of records or a `SelectRecordData` object for more advanced configuration.

**Parameters:**

* `records: any[] | SelectRecordData`
    * If `any[]`: An array of objects to be displayed in the grid. The properties of these objects will be used to automatically generate columns.
    * If `SelectRecordData`: An object with the following properties:
        * `records: any[]`: The array of objects to display in the grid.
        * `title?: UiText`: Optional. A title to display in the header of the record selection dialog. This can be a simple string or styled text (created with `styledText().value`).
        * `multiple?: boolean`: Optional. If `true`, enables multi-selection mode, allowing the user to select more than one record. Defaults to `false` for single selection.
        * `columns?: GridColumn[]`: Optional. An array of `GridColumn` objects to explicitly define the columns of the grid. If not provided, columns will be automatically generated by analyzing the properties of the first 1000 objects in the `records` array.
            * `GridColumn` interface:
                * `key: string`: The property name from the record objects to display in this column.
                * `title?: string`: Optional. The display title for the column header. If not provided, the `key` will be used.
                * `width?: number`: Optional. The initial width of the column in pixels.
        * `buttons?: UiText[]`: Optional. An array of strings or `UiText` objects to be displayed as action buttons.
            * If not provided, the default button is `!Proceed` (disabled until at least one record is selected if `multiple` is true, or exactly one record if `multiple` is false).
            * To make a button required (disabled until a valid selection is made), prefix its label with `!`, for example, `"!OK"`. This `!` character is a directive and will not be displayed on the UI button itself, nor will it be part of the `resultButton` value returned.

**Returns:**

* `Promise<{ result?: any[]; resultButton?: string } | undefined>`: A promise that resolves with an object containing:
    * `result?: any[]`: An array of the selected record objects. In single-selection mode, this array will contain at most one object.
    * `resultButton?: string`: The label of the button pressed by the user. If a button was specified with a `!` prefix (e.g., `"!OK"`), the `resultButton` will be returned *without* the `!` (e.g., `"OK"`).
    If the component is dismissed (e.g., if the host environment allows external dismissal, though explicitly provided cancel buttons are recommended), it resolves with `undefined`.

**Behavior Notes:**

* **Inline Interaction**: This component is rendered directly within the "Script UI" panel and is not a separate modal pop-up window. It remains active until a button is pressed.
* **No Implicit Dismissal**: There is no built-in dismiss action or `Escape` key handling. To provide a "Cancel" option, you must explicitly include a "Cancel" button in the `buttons` array (without the `!` prefix so it can be clicked without any selection).
* **Default Button**: If no `buttons` array is explicitly provided, the dialog will show a single "Proceed" button. This default "Proceed" button behaves as `!Proceed`, meaning it will be disabled until the user makes a selection.
* **Selection Mechanism**:
    * In single-selection mode (`multiple: false`), the user can click on any row to select it, and the selected row will be highlighted.
    * In multiple-selection mode (`multiple: true`), an additional column with a checkbox will be added as the first column. Users select multiple records by clicking on the checkboxes.

**Usage Examples:**
For comprehensive examples demonstrating the usage of `ui.dialog.selectRecord()`, including basic record selection, single vs. multiple modes, custom columns, and handling large datasets, please refer to the [Select Record Demo Script](../demo/components/ui.dialog.selectRecord.ts).

### Inline Components

#### `ui.inline.select<T = any>(options: SelectData<T>)` <a id="uiinlineselect"></a>

The `ui.inline.select()` method displays an inline interactive component within the "Script UI" panel, presenting a label, a dropdown (combobox) for selecting a single value from a list of options, and optional action buttons. Script execution pauses until the user makes a selection and confirms by clicking a button. This is ideal for compactly presenting a single-choice selection to the user within the script's output flow.

Unlike the bordered `ui.dialog` components, inline components are rendered as a single, non-bordered line. If elements do not fit on one line, they will wrap, using flexbox styles (`display: 'flex'`, `flexDirection: 'row'`, `alignItems: 'center'`, `flexWrap: 'wrap'`) to maintain compactness. The component visually appears as `<label> <combobox with options> <buttons>`.

**Parameters:**

* `options: SelectData<T>`: An object specifying the configuration for the select component:
    * `label: UiText`: The text or styled text to display as the label for the select dropdown.
    * `options: T[]`: An array of values or objects from which the user can select. These values will populate the dropdown list.
    * `labelKey?: string`: Optional. If `options` is an array of objects, specify the key (property name) within each object whose value should be used as the display text in the dropdown. If not provided, by default, the 'label' property of the object will be displayed if it exists; otherwise, nothing will be displayed.
    * `buttons?: UiText[]`: Optional. An array of strings or `UiText` objects to be displayed as action buttons.
        * If not provided, the default button is `!Proceed` (disabled until an option is selected).
        * To make a button required (disabled until a selection is made in the dropdown), prefix its label with `!`, for example, `"!Select"`. This `!` character is a directive and will not be displayed on the UI button itself, nor will it be part of the `resultButton` value returned.

**Returns:**

* `Promise<{ result?: T; resultButton?: string } | undefined>`: A promise that resolves with an object containing:
    * `result?: T`: The value of the option selected by the user. The type `T` will match the type of items in your `options` array.
    * `resultButton?: string`: The label of the button pressed by the user. If a button was specified with a `!` prefix (e.g., `"!Select"`), the `resultButton` will be returned *without* the `!` (e.g., `"Select"`).
    If the component is dismissed (e.g., if the host environment allows external dismissal, though explicitly provided cancel buttons are recommended), it resolves with `undefined`.

**Behavior Notes:**

* **Inline Rendering**: This component is rendered directly within the "Script UI" panel as a compact, non-bordered element. It adapts to available space by wrapping its content.
* **No Implicit Dismissal**: There is no built-in dismiss action or `Escape` key handling. To provide a "Cancel" option, you must explicitly include a "Cancel" button in the `buttons` array (without the `!` prefix so it can be clicked without any selection).
* **Default Button**: If no `buttons` array is explicitly provided, the dialog will show a single "Proceed" button. This default "Proceed" button behaves as `!Proceed`, meaning it will be disabled until the user selects an option from the dropdown.

**Usage Examples:**
For comprehensive examples demonstrating the usage of `ui.inline.select()`, including selecting simple options, selecting objects with `labelKey`, and using custom required buttons, please refer to the [Inline Select Demo Script](../demo/components/ui.inline.select.ts).

#### `ui.inline.confirm(params: UiText | InlineConfirmData)` <a id="uiinlineconfirm"></a>

The `ui.inline.confirm()` method displays a compact, inline confirmation component directly within the "Script UI" panel. It is functionally similar to `ui.dialog.confirm()` but is designed for a more minimalist presentation, rendering a message followed by action buttons on a single line (wrapping if content overflows). It pauses script execution until the user interacts with one of the buttons.

This method is ideal for quick "yes/no" or "confirm/cancel" interactions where a full dialog box is unnecessary, maintaining a streamlined visual flow within the script's output.

**Parameters:**

* `params: UiText | InlineConfirmData`
    * If `UiText`: The message to display for the confirmation. Default "No" and "Yes" buttons will be provided.
    * If `InlineConfirmData`: An object with the following properties:
        * `message: UiText`: The main message content of the confirmation component. This can be a simple string or styled text (created with `styledText().value`).
        * `buttons?: UiText[]`: Optional. An array of strings or `UiText` objects to be displayed as action buttons.
            * If not provided, default "No" and "Yes" buttons are used.
            * To make a button required (e.g., if you had additional inline inputs for which this button depends on), prefix its label with `!`, for example, `"!Proceed"`. This `!` character is a directive and will not be displayed on the UI button itself, nor will it be part of the `result` value returned. However, for a simple confirmation with no other inputs, marking a button as required (`!`) typically has no additional functional effect as interaction itself implies confirmation.

**Returns:**

* `Promise<string | undefined>`: A promise that resolves with the `string` value of the button pressed by the user. If the component is dismissed (e.g., if the host environment allows external dismissal, though explicit button presses are the intended interaction), it resolves with `undefined`.

**Behavior Notes:**

* **Inline Rendering**: This component is rendered directly within the "Script UI" panel as a compact, non-bordered element. It primarily displays a message followed by buttons, arranged on a single line and wrapping if content requires.
* **No Implicit Dismissal**: There is no built-in dismiss action or `Escape` key handling. User interaction with one of the explicit buttons is required for the script to proceed.
* **Default Buttons**: If no `buttons` array is explicitly provided, the component will show standard "No" and "Yes" buttons.

**Usage Examples:**
For comprehensive examples demonstrating the usage of `ui.inline.confirm()`, including basic confirmations and custom styled buttons, please refer to the [Inline Confirm Demo Script](../demo/components/ui.inline.confirm.ts).

#### `ui.inline.textInput(params: UiText | TextInputData)` <a id="uiinlinetextinput"></a>

The `ui.inline.textInput()` method displays a compact, inline interactive component within the "Script UI" panel that provides a single-line text input field. It functions similarly to `ui.dialog.textInput()` but is designed for a more minimalist, horizontal presentation without multi-line support. Script execution pauses until the user submits text or confirms an action via a button.

This method is suitable for quickly gathering short, single-line textual input from the user directly within the script's output stream, maintaining a compact visual layout. The component visually appears as `<message/title> <input field> <buttons>`.

**Parameters:**

* `params: UiText | TextInputData`
    * If `UiText`: The title or prompt to display for the text input. Default `!Proceed` button will be provided.
    * If `TextInputData`: An object with the following properties:
        * `title: UiText`: The title or prompt for the text input component. This can be a simple string or styled text (created with `styledText().value`).
        * `buttons?: UiText[]`: Optional. An array of strings or `UiText` objects to be displayed as action buttons.
            * If not provided, the default button is `!Proceed`.
            * To make a button required (disabled until text is entered), prefix its label with `!`, for example, `"!OK"`. This `!` character is a directive and will not be displayed on the UI button itself, nor will it be part of the `resultButton` value returned.
        * `result?: string`: Optional. An initial string value to pre-populate the single-line text input field.

**Returns:**

* `Promise<{ result?: string; resultButton?: string } | undefined>`: A promise that resolves with an object containing:
    * `result?: string`: The text entered by the user.
    * `resultButton?: string`: The label of the button pressed by the user. If a button was specified with a `!` prefix (e.g., `"!OK"`), the `resultButton` will be returned *without* the `!` (e.g., `"OK"`).
    If the component is dismissed (e.g., if the host environment allows external dismissal, though explicit button presses are the intended interaction), it resolves with `undefined`.

**Behavior Notes:**

* **Inline Rendering**: This component is rendered directly within the "Script UI" panel as a compact, non-bordered element. It displays the title, input field, and buttons on a single line, wrapping content if necessary using flexbox styles.
* **Single-line Input**: Unlike `ui.dialog.textInput()`, this method *does not support multi-line text input*. The input field will always be a single line.
* **No Implicit Dismissal**: There is no built-in dismiss action or `Escape` key handling. To provide a "Cancel" option, you must explicitly include a "Cancel" button in the `buttons` array (without the `!` prefix so it can be clicked without any text input).
* **Default Button**: If no `buttons` array is explicitly provided, the dialog will show a single "Proceed" button. This default "Proceed" button behaves as `!Proceed`, meaning it will be disabled until the user enters some text into the input field.

**Usage Examples:**
For comprehensive examples demonstrating the usage of `ui.inline.textInput()`, including basic input, custom buttons (and required buttons), initial text, and styled elements, please refer to the [Inline Text Input Demo Script](../demo/components/ui.inline.textInput.ts).

#### `ui.inline.dateInput(params?: UiText | DateInputData)` <a id="uiinlinedateinput"></a>

The `ui.inline.dateInput()` method displays a compact, inline interactive component within the "Script UI" panel that allows the user to select a date. It functions similarly to `ui.dialog.dateInput()` but is designed for a more minimalist, horizontal presentation. It renders a message/title, followed by an input field that triggers a popup calendar for date selection, and then action buttons. Script execution pauses until the user selects a date and confirms by clicking a button.

This method is ideal for compactly gathering date input directly within the script's output stream, maintaining a streamlined visual flow.

**Parameters:**

* `params?: UiText | DateInputData`
    * If `UiText`: An optional title or prompt for the date input. Default `!Proceed` button will be provided.
    * If `DateInputData`: An object with the following properties:
        * `title?: UiText`: Optional. A title or prompt to display for the date input component. This can be a simple string or styled text (created with `styledText().value`).
        * `buttons?: UiText[]`: Optional. An array of strings or `UiText` objects to be displayed as action buttons.
            * If not provided, the default button is `!Proceed`.
            * To make a button required (disabled until a date is selected), prefix its label with `!`, for example, `"!OK"`. This `!` character is a directive and will not be displayed on the UI button itself, nor will it be part of the `resultButton` value returned.
        * `result?: Date`: Optional. An initial `Date` object to pre-select in the calendar.

**Returns:**

* `Promise<{ result?: Date; resultButton?: string } | undefined>`: A promise that resolves with an object containing:
    * `result?: Date`: A JavaScript `Date` object representing the date selected by the user.
    * `resultButton?: string`: The label of the button pressed by the user. If a button was specified with a `!` prefix (e.g., `"!OK"`), the `resultButton` will be returned *without* the `!` (e.g., `"OK"`).
    If the component is dismissed (e.g., if the host environment allows external dismissal, though explicit button presses are the intended interaction), it resolves with `undefined`.

**Behavior Notes:**

* **Inline Rendering**: This component is rendered directly within the "Script UI" panel as a compact, non-bordered element. It displays the title, date input field (which shows a popup calendar on interaction), and buttons on a single line, wrapping content if necessary using flexbox styles.
* **No Implicit Dismissal**: There is no built-in dismiss action or `Escape` key handling. To provide a "Cancel" option, you must explicitly include a "Cancel" button in the `buttons` array (without the `!` prefix so it can be clicked without a date selection).
* **Default Button**: If no `buttons` array is explicitly provided, the dialog will show a single "Proceed" button. This default "Proceed" button behaves as `!Proceed`, meaning it will be disabled until the user selects a date.

**Usage Examples:**
For comprehensive examples demonstrating the usage of `ui.inline.dateInput()`, including basic date selection, custom buttons, initial date values, and styled elements, please refer to the [Inline Date Input Demo Script](../demo/components/ui.inline.dateInput.ts).

### Output Components

#### `ui.show.gridFromJsonArray(data: any[] | GridData)` <a id="uishowgridfromjsonarray"></a>

The `ui.show.gridFromJsonArray()` method displays an interactive data grid within the "Script UI" panel. This is an **output-only** method; it is not asynchronous and does not return any response to the script. It's designed for visualizing tabular data, offering built-in functionalities to enhance data exploration.

The displayed grid features include:
* **Sorting**: Users can sort data by clicking on column headers.
* **Filtering**: A search input in the header allows users to filter records.
* **Column Sizing and Reordering**: Columns can be resized and reordered by the user directly in the UI.
* **Scrollable**: The grid has a maximum height of `400px` and will automatically scroll if the number of records exceeds this height.
* **"Open in separate window" Button**: A button is available in the grid's title bar, allowing the user to open the entire grid in a new, dedicated VS Code editor tab for a larger, more focused view.

**Parameters:**

* `data: any[] | GridData`
    * If `any[]`: A simple array of objects to be displayed as rows in the grid. Columns will be automatically generated.
    * If `GridData`: An object with the following properties:
        * `data: any[]`: The array of objects to display in the grid.
        * `title?: UiText`: Optional. A title to display in the header of the grid. This can be a simple string or styled text (created with `styledText().value`).
        * `columns?: GridColumn[]`: Optional. An array of `GridColumn` objects to explicitly define the grid's columns.
            * If `columns` is not provided, the system will automatically generate columns by analyzing the properties of the first 1000 objects in the `data` array.
            * `GridColumn` interface:
                * `key: string`: The property name from the data objects whose value should be displayed in this column.
                * `title?: string`: Optional. The display title for the column header. If not provided, the `key` will be used.
                * `width?: number`: Optional. The initial width of the column in pixels.

**Returns:**

* `void`: This method does not return any value and does not pause script execution. The grid is displayed as output, and the script continues running immediately.

**Usage Examples:**
For comprehensive examples demonstrating the usage of `ui.show.gridFromJsonArray()`, including displaying simple data arrays, custom titles and columns, and interacting with the grid features, please refer to the [Grid From JSON Array Demo Script](../demo/components/ui.show.gridFromJsonArray.ts).

#### `ui.show.textBlock(data: string | TextData)` <a id="uishowtextblock"></a>

The `ui.show.textBlock()` method displays a formatted block of text within the "Script UI" panel. This is an **output-only** method; it is not asynchronous and does not return any response to the script. It's suitable for presenting larger chunks of text, such as logs, detailed information, or script results, in a structured and readable manner.

The displayed text block features:
* **Header and Content**: It displays an optional header (title) at the top, with the main text content presented below it.
* **Scrollable**: The block has a maximum height of `400px`. If the text content exceeds this height, the block will automatically become scrollable.
* **"Open in separate window" Button**: A button is available in the block's header, allowing the user to open the entire text content in a new, dedicated VS Code editor tab for easier reading and interaction (e.g., copying).

**Parameters:**

* `data: string | TextData`
    * If `string`: A simple string containing the text to be displayed in the block.
    * If `TextData`: An object with the following properties:
        * `text: string`: The main text content to display within the block.
        * `title?: UiText`: Optional. A title to display in the header of the text block. This can be a simple string or styled text (created with `styledText().value`).

**Returns:**

* `void`: This method does not return any value and does not pause script execution. The text block is displayed as output, and the script continues running immediately.

**Usage Examples:**
For comprehensive examples demonstrating the usage of `ui.show.textBlock()`, including displaying large text and using styled titles, please refer to the [Text Block Demo Script](../demo/components/ui.show.textBlock.ts).

#### `ui.show.progress(label: UiText | ProgressData)` <a id="uishowprogress"></a>

The `ui.show.progress()` method displays a dynamic progress indicator within the "Script UI" panel, designed to visualize the status of long-running operations. This method is **output-only** in its initial call (it does not pause script execution and is not `async` itself); however, it returns a `Progress` object that allows the script to update the state of the *already displayed* progress indicator in real-time.

The progress component is rendered inline on a single line. Its visual appearance adapts based on the provided data:
* If `completed` is `false` (or not set), an animated spinner is displayed at the start. If `completed` is set to `true`, a check icon replaces the spinner.
* If `max` and `value` are provided, a progress bar is rendered, visually growing from 0% to 100%.
* If `max` is not provided, only the spinner/check indicator and the label are shown, without a progress bar.
* The `label` text is displayed at the end of the line.

**Parameters:**

* `label: UiText | ProgressData`
    * If `UiText`: A simple string or `UiText` object to serve as the initial label for the progress indicator.
    * If `ProgressData`: An object defining the initial state of the progress indicator:
        * `label?: UiText`: Optional. The initial text or styled text to display next to the progress indicator.
        * `max?: number`: Optional. The maximum value for the progress bar. If set, a progress bar will be displayed.
        * `value?: number`: Optional. The current value of the progress. Used in conjunction with `max` to calculate the progress bar fill.
        * `completed?: boolean`: Optional. If `true`, the progress indicator will immediately show as completed (e.g., with a check icon). Defaults to `false`.

**Returns:**

* `Progress`: An instance of the `Progress` class. This object provides properties and methods to dynamically update the displayed progress indicator.

**`Progress` Class Properties and Methods:**

The returned `Progress` object has the following properties, which can be set to update the component in the "Script UI" panel:

* `label: UiText | undefined`: Get or set the display text for the progress indicator.
* `max: number | undefined`: Get or set the maximum value for the progress bar.
* `value: number | undefined`: Get or set the current value of the progress.
* `completed: boolean | undefined`: Get or set the completion status. Setting it to `true` typically shows a success indicator.

Each time a setter (`label`, `max`, `value`, `completed`) is used, an updated message is sent to the "Script UI" panel, causing the corresponding progress component to rerender with the new state.

* `conpleteWhenPromise(promise: Promise<any>, completeText?: UiText)`: A utility method that automatically sets `completed = true` and optionally updates the `label` of the progress indicator once the provided `promise` resolves (successfully or with an error). This is convenient for tying the progress display directly to asynchronous operations.

**Usage Examples:**
For examples demonstrating how to initialize and dynamically update `ui.show.progress()`, including tracking long-running tasks and tying completion to Promises, please refer to:
* [Progress Demo Script](../demo/components/ui.show.progress.ts)
* [Parallel Processes Demo Script](../demo/features/paralel-processes.ts)

### Window Components

#### `ui.window.showGrid(data: any[] | WindowGridData)` <a id="uiwindowshowgrid"></a>

The `ui.window.showGrid()` method opens an interactive data grid in a **new, dedicated VS Code editor window**. This is an **output-only** method; it is not asynchronous and does not return any response to the script. It is particularly useful for visualizing large datasets that benefit from a full-screen, focused view and rich interaction capabilities.

The grid displayed in the new window offers comprehensive functionality, similar to `ui.show.gridFromJsonArray()`, including:
* **Sorting**: Data can be sorted by clicking on column headers.
* **Filtering**: A search input allows users to filter the displayed records.
* **Column Management**: Users can resize and reorder columns directly within the grid.

**Parameters:**

* `data: any[] | WindowGridData`
    * If `any[]`: A simple array of objects to be displayed as rows in the grid. Columns will be automatically generated based on the properties of these objects.
    * If `WindowGridData`: An object with the following properties:
        * `data: any[]`: The array of objects to display as rows in the grid.
        * `title?: UiText`: Optional. A title to display in the header of the new grid window. This can be a simple string or styled text (created with `styledText().value`).
        * `columns?: GridColumn[]`: Optional. An array of `GridColumn` objects to explicitly define the grid's columns. If not provided, columns will be automatically generated by analyzing the properties of the data objects.
            * `GridColumn` interface:
                * `key: string`: The property name from the data objects whose value should be displayed in this column.
                * `title?: string`: Optional. The display title for the column header. If not provided, the `key` will be used.
                * `width?: number`: Optional. The initial width of the column in pixels.

**Returns:**

* `void`: This method does not return any value. The grid is opened in a separate window, and the script continues running immediately without waiting for any user interaction within that new window.

**Behavior Notes:**

* **Separate VS Code Window**: This method is specifically designed to open the grid content in a completely new VS Code editor tab, providing ample space for data exploration.
* **Non-Blocking**: The script continues execution as soon as the command to open the new window is sent. It does not pause to wait for any user interaction with the opened grid.

**Usage Examples:**
For an example demonstrating how to use `ui.window.showGrid()` to open a JSON array as a grid in a new VS Code window, please refer to the [Show Grid Demo Script](../demo/components/ui.window.showGrid.ts).

#### `ui.window.showText(text: string | WindowTextData)` <a id="uiwindowshowtext"></a>

The `ui.window.showText()` method opens the provided text content in a **new, dedicated VS Code editor tab**. This method leverages native VS Code commands to display arbitrary text, effectively turning a string into a viewable document within the IDE. It is an **output-only** method; it is not asynchronous and does not return any response to the script.

This is highly useful for displaying large blocks of text, code snippets, logs, or any textual output that benefits from the full capabilities of the VS Code editor, such as syntax highlighting, searching, and copying.

**Parameters:**

* `text: string | WindowTextData`
    * If `string`: The plain text content to open in a new editor tab.
    * If `WindowTextData`: An object with the following properties:
        * `text: string`: The text content to display.
        * `language?: string`: Optional. A string identifier for the language mode (e.g., `"json"`, `"typescript"`, `"plaintext"`, `"markdown"`) to apply syntax highlighting to the text in the new editor. If not provided, VS Code will attempt to auto-detect the language or default to plain text.

**Returns:**

* `void`: This method does not return any value. The text is opened in a separate VS Code editor tab, and the script continues running immediately without waiting for any user interaction with that new window.

**Behavior Notes:**

* **Separate VS Code Editor**: This method is specifically designed to open the text content in a completely new VS Code editor tab, providing a native editing experience.
* **Non-Blocking**: The script continues execution as soon as the command to open the new editor is sent. It does not pause to wait for any user interaction within that new window.
* **Syntax Highlighting**: By providing a `language` identifier, you can enable appropriate syntax highlighting for the displayed text.

**Usage Examples:**
For an example demonstrating how to use `ui.window.showText()` to open text content in a new VS Code window, including specifying a language mode, please refer to the [Show Text Demo Script](../demo/components/ui.window.showText.ts).

### Event Subscriptions

The "Interactive Script" extension provides mechanisms to subscribe to and manage console output (`stdout` and `stderr`) generated by your script or its third-party dependencies. This is particularly useful when external libraries produce a large volume of logs or warnings that might clutter the "Script UI" panel, making it harder to interact with the interactive UI elements or read relevant output.

The extension intelligently distinguishes between its own UI command messages and other console outputs (logs, warnings, errors). When a script uses these methods to subscribe to console events, the extension will no longer print the intercepted messages directly to the "Script UI" panel. Instead, it reroutes them to the script's provided callback function, giving the script full control over how to handle this output. This helps to keep the "Script UI" panel clean and focused on interactive dialogs and structured data.

#### `ui.on.consoleLog(callback: (message: string) => void)` <a id="uionconsolelogcallback"></a>

This method allows your script to subscribe to and handle messages that would typically be sent to `stdout` (e.g., via `console.log()` in JavaScript/TypeScript).

* **Purpose**: To intercept and process standard console log messages generated by the script or its underlying modules.
* **Behavior**: Once a callback is registered using this method, any subsequent `console.log` output from the script's process will *not* be displayed directly in the "Script UI" panel. Instead, the raw string content of each log message will be passed to the provided `callback` function.
* **Parameters**:
    * `callback: (message: string) => void`: A function that will be called with the intercepted log message as a string argument.
* **Returns**: An object representing the subscription. This object can be used to manage the subscription (e.g., to unsubscribe later, though the specific method for unsubscribing is not detailed in the provided definition).

#### `ui.on.consoleError(callback: (message: string) => void)` <a id="uionconsoleerrorcallback"></a>

This method is analogous to `ui.on.consoleLog()`, but it specifically handles messages sent to `stderr` (e.g., via `console.error()` or `console.warn()` in JavaScript/TypeScript).

* **Purpose**: To intercept and process console error and warning messages generated by the script or its dependencies.
* **Behavior**: Similar to `consoleLog`, once a callback is registered, `console.error` and `console.warn` outputs will be rerouted from the "Script UI" panel to the provided `callback` function.
* **Parameters**:
    * `callback: (message: string) => void`: A function that will be called with the intercepted error/warning message as a string argument.
* **Returns**: An object representing the subscription.

**Benefits of Console Event Subscriptions:**

By subscribing to `consoleLog` and `consoleError`, scripts gain fine-grained control over their output. This enables several scenarios:
* **Clean UI**: Prevents verbose third-party library outputs from cluttering the main "Script UI" panel, keeping it reserved for interactive components.
* **Custom Handling**: The script can decide where to direct the intercepted messages (e.g., to the VS Code "OUTPUT" panel (using `ui.output.append()`), to a file, to an external logging service, or simply ignore them).
* **Enhanced Debugging**: Allows for custom logging formats or conditional logging based on script logic.

**Usage Examples:**
For a practical demonstration of how to use `ui.on.consoleLog()` and `ui.on.consoleError()` to handle and redirect console output, please refer to the [Handle Console Demo Script](../demo/features/handle-console.ts).

#### `styledText()` <a id="styledtext-function"></a>

The `styledText()` function is a helper function used to create a `StyledText` object. This object is not directly printed to the UI panel but is primarily used to generate styled text content for other UI components that accept styled labels or messages (e.g., buttons in `ui.dialog.buttons()`).

It provides the same styling capabilities as the `StyledLogCommand` (which extends `StyledText`), allowing you to define custom colors, backgrounds, font sizes, and other CSS properties for text used within interactive elements.

**Methods:**

* `.color(color: StyledTextColor)`: Sets the text color.
* `.background(color: StyledTextColor)`: Sets the background color of the text.
* `.border(color: StyledTextColor)`: Adds a border around the text.
* `.fontSize(size: string | number)`: Sets the font size.
* `.underline()`: Underlines the text.
* `.italic()`: Makes the text italic.
* `.bold()`: Makes the text bold.
* `.then(text?: string)`: Appends additional text, allowing for different styles for parts of the string.
* `.style(styles: Styles)`: Applies arbitrary CSS styles.
* `.value`: The final `UiText` array representation of the styled text, ready to be passed to UI components.

#### `StyledTextColor`

`StyledTextColor` is a type used to define color values for styling text within the Script UI. It provides strong type-checking and Intellisense for color properties used in methods like `.color()` and `.background()`. Essentially, it corresponds to the `CSSProperties['color']` type, compatible with web view rendering powered by React.

This type accepts:
* **Named CSS Colors**: Standard named colors that web browsers understand (e.g., `"red"`, `"blueviolet"`, `"lightseagreen"`).
* **Hexadecimal values**: For example, `"#RRGGBB"` or `"#RGB"`.
* **RGB/RGBA values**: For example, `"rgb(255, 0, 0)"` or `"rgba(255, 0, 0, 0.5)"`.
* **HSL/HSLA values**: For example, `"hsl(120, 100%, 50%)"` or `"hsla(120, 100%, 50%, 0.7)"`.
* The keyword `"transparent"`.

This type primarily enhances the developer experience by providing suggestions for valid color strings.

**Usage Example:**

```typescript
import ui, { styledText } from "interactive-script-js";

async function styledTextExample() {
    // Creating styled button labels using styledText()
    const pressedButton = await ui.dialog.buttons([
        styledText("Option A").color("yellow").value,
        styledText("Option B").color("lime").value,
        styledText("Option C").color("lightcoral").value,
    ]);
    ui.log(`You selected: ${pressedButton}`).print();
}

styledTextExample();
```

---

<div style="text-align: right;">
    <a href="documentation.md">Back to Documentation Home</a>
</div>