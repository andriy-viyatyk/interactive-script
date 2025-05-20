<div style="text-align: right;">
    <a href="documentation.md">Back to Documentation Home</a>
</div>

---

# Overview

## Purpose and Main Focus

The "Interactive Script" extension is designed to empower your scripts with essential user interface capabilities, enabling direct interaction with the user within the familiar VS Code environment. It provides a curated set of components and dialogs, transforming otherwise passive scripts into dynamic, interactive tools.

**It's important to understand the core philosophy:** This extension does not aim to be a comprehensive UI builder or a framework for creating arbitrary graphical user interfaces. Developing complex, full-featured UIs is generally beyond the scope of a script's responsibilities and is better handled by dedicated web applications or desktop frameworks.

Instead, "Interactive Script" focuses on **simplicity and practicality**. Its goal is to offer a robust collection of well-designed, useful components and dialogs that enhance the interactivity of your scripts where it truly matters.

Consider a common scenario: your script downloads thousands of entities, and you need to select just a few to proceed. Without "Interactive Script," a developer might have to save these entities to a file, manually search for the needed ones, and then copy them into a separate script or input. With this extension, you can simply call `ui.dialog.selectRecord(entities)`. The entities will be displayed in an interactive grid within the "Script UI" panel, complete with filtering, sorting, and selection functionalities, streamlining your workflow significantly.

The project's primary focus is on providing a straightforward, easy-to-use set of rendered components that offer tangible utility and a clean design, enabling developers to inject interactivity precisely where it enhances their script-driven workflows.


## How Interactive Script Works

The "Interactive Script" VS Code extension empowers your scripts to become interactive by establishing a seamless communication channel between your running script and the VS Code "Script UI" panel. This document explains the underlying mechanism that enables this rich interaction.


## The Communication Backbone: Stdin/Stdout

At its core, the communication between your executing script and the "Interactive Script" extension relies on standard input (`stdin`) and standard output (`stdout`).

1.  **Script Execution:** When you click the "Run" button in the "Script UI" panel's header, the extension spawns a new process for your active JavaScript/TypeScript or Python file.
2.  **Output Stream:** Your script, using the `interactive-script-js` or `interactive-script-py` client library, writes special command messages to its `stdout`.
3.  **Input Stream:** The extension listens to the script's `stdout`. It reads all incoming messages and intelligently distinguishes between regular log output and specific "command messages" intended for the "Script UI" panel. For any regular text printed to `stdout`, it's displayed as a standard log in the panel.
4.  **Command Recognition:** A command message is identified by a "magic line" (`[>-command-<]`) followed immediately by a JSON string. This JSON represents the specific command and its parameters (e.g., display a dialog, show a progress bar, or log styled text).
5.  **UI Rendering:** Upon receiving a command message, the extension parses the JSON and performs the corresponding action in the "Script UI" panel – whether it's rendering an interactive dialog, updating a progress bar, displaying a grid, or showing styled logs.

## Two-Way Interaction: Commands with and without Responses

Commands executed by your script using the client library generally fall into two categories:

### 1. "Fire-and-Forget" Commands

These commands send instructions to the extension without expecting a direct response back to the script. Examples include:

* `ui.log()`: Simply prints a message to the "Script UI" panel.
* `ui.info()`, `ui.warn()`, `ui.error()`, `ui.success()`: Print styled messages.
* `ui.show.progress()`: Initiates or updates a progress indicator.

For these commands, the client library sends the command message to `stdout`, and the script continues execution immediately.

### 2. "Request-Response" Commands

These commands trigger an interactive element in the "Script UI" panel (like a dialog or an input field) and **pause the script's execution** until the user provides a response. Examples include:

* `ui.dialog.confirm()`: Displays a confirmation dialog and waits for the user to click "Yes" or "No".
* `ui.dialog.textInput()`: Presents a text input field and waits for the user to submit text.
* `ui.dialog.selectRecord()`: Displays a record selection UI and waits for user choice.

**How Request-Response Works:**

1.  When a "request-response" command is executed in your script (e.g., `await ui.dialog.confirm("Question?")`), the client library:
    * Generates a unique `commandId` (a random GUID) for this specific interaction.
    * Creates a Promise (in JavaScript/TypeScript) or a similar asynchronous mechanism (in Python) and associates it with this `commandId`.
    * Sends the command message (including the `commandId`) to the extension via `stdout`.
    * The script then "awaits" this Promise/asynchronous operation.
2.  The extension receives the command, renders the interactive UI element, and waits for user interaction.
3.  Once the user interacts (e.g., clicks a button, submits text), the extension sends a response message back to the script's `stdin`, also containing the original `commandId`.
4.  The client library's internal message handler listens to `stdin`. When it receives a response message, it looks up the associated Promise/asynchronous operation using the `commandId` and resolves it with the user's response.
5.  The `await` call in your script then receives the result, and script execution continues.

This asynchronous `await` pattern is essential for "request-response" commands, as it allows your script to pause gracefully while waiting for user input without blocking the entire VS Code UI.

---

## Dive Deeper: API Reference

To learn more about the specific commands available and how to use them in your JavaScript/TypeScript or Python scripts, please refer to the detailed [API Reference](api.md) document.

---
<div style="text-align: right;">
    <a href="documentation.md">Back to Documentation Home</a>
</div>