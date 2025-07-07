<div style="text-align: right;">
    <a href="documentation.md">Back to Documentation Home</a>
</div>

---

## Interactive Script Settings

### `interactiveScript.workingDirectory`
- **Type**: `string`
- **Default**: `workspace`
- **Description**: Specifies the working directory for script execution.
    - `workspace`: Uses the VS Code workspace folder as the working directory.
    - `file`: Uses the directory of the currently running script as the working directory.

### `interactiveScript.pythonPathSource`
- **Type**: `string`
- **Default**: `extension`
- **Description**: Determines how the Python executable path is resolved.
    - `extension`: Automatically uses the Python extension (ms-python.python) to determine the path.
    - `manual`: Manually specify the path to the Python executable.

### `interactiveScript.manualPythonPath`
- **Type**: `string`
- **Default**: `python`
- **Description**: Manually specifies the full path to the Python executable. This path is used when 'Python Path Source' is set to 'manual', or as a fallback if the Python extension (ms-python.python) is not found or fails to provide a path.

### `interactiveScript.nodeArgs`
- **Type**: `array` of `string`
- **Default**: `[]`
- **Description**: Additional command-line arguments to pass to the `node` executable. E.g., `["--inspect", "--no-warnings"]`

### `interactiveScript.tsNodeArgs`
- **Type**: `array` of `string`
- **Default**: `[]`
- **Description**: Additional command-line arguments to pass to the `ts-node` executable. E.g., `["--transpile-only"]`

### `interactiveScript.pythonArgs`
- **Type**: `array` of `string`
- **Default**: `[]`
- **Description**: Additional command-line arguments to pass to the `python` executable. E.g., `["-u", "-OO"]`

### `interactiveScript.powershellArgs`
- **Type**: `array` of `string`
- **Default**: `["-ExecutionPolicy", "Bypass"]`
- **Description**: Additional command-line arguments to pass to the `pwsh` executable. E.g., `["-NoLogo", "-ExecutionPolicy", "Bypass"]`

---

<div style="text-align: right;">
    <a href="documentation.md">Back to Documentation Home</a>
</div>