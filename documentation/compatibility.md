<div style="text-align: right;">
    <a href="documentation.md">Back to Documentation Home</a>
</div>


# Version Compatibility Guide

This document outlines the compatibility between the "Interactive Script" VS Code extension and its client libraries (`interactive-script-js` for JavaScript/TypeScript and `interactive-script-py` for Python).

---

⚠️ **Important:** To ensure stable and correct functionality, it is critical to use compatible versions of the "Interactive Script" VS Code extension and its client libraries. Incompatible versions may lead to unexpected behavior, errors, or features not working as intended.

VS Code extensions are updated automatically, but you must manually update your client libraries in your project:
* For JavaScript/TypeScript: Run `npm update interactive-script-js` in your project directory.
* For Python: Run `pip install --upgrade interactive-script-py` in your project's virtual environment.

## Installing Older Extension Versions

In situations where a specific client library version is required for compatibility, or if you encounter issues with the latest extension update, you have the option to install an older version of the "Interactive Script" VS Code extension.

To do this:

1.  Go to the Extensions view in VS Code (`Ctrl+Shift+X` / `Cmd+Shift+X`).
2.  Search for "Interactive Script".
3.  Click on the "Interactive Script" entry to open its details page.
4.  On the extension's detail page, click the **gear icon** (⚙️) or the **"Uninstall" dropdown** (next to the "Disable" or "Uninstall" button).
5.  From the dropdown menu, select **"Install Another Version..."**.
6.  A list of available older versions will appear. Select the version you wish to install.

VS Code will then install the selected older version of the extension. Remember to check the [Compatibility Matrix](#compatibility-matrix) to ensure your client libraries (`interactive-script-js` or `interactive-script-py`) match the chosen extension version.

## Compatibility Matrix

We strive to maintain backward compatibility where possible, but significant changes in the extension may require a corresponding update to the client libraries. Refer to the table below for recommended and required pairings.

| VS Code Extension Version | `interactive-script-js` Version | `interactive-script-py` Version | `interactive-script-ps` Version |
| :--- | :--- | :--- | :--- |
| 1.0.8 | 1.0.6 | 1.0.6 | 1.0.0 |
| 1.0.7 | 1.0.6 | 1.0.6 |
| 1.0.6 | 1.0.5 | 1.0.5 |
| 1.0.5 | 1.0.4 | 1.0.4 |
| 1.0.4 | 1.0.3 | 1.0.3 |
| 1.0.3 | 1.0.3 | 1.0.3 |

---

<div style="text-align: right;">
    <a href="documentation.md">Back to Documentation Home</a>
</div>