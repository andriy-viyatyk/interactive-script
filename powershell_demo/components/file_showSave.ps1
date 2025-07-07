. "$PSScriptRoot\..\interactive-script-ps.ps1"

$ui.text("You can render input in Script UI for file path to save.");
$response = $ui.file_showSave("Save file");
$ui.text("You selected:");
$response.result

$ui.text("");
$ui.text("You can pass optional filters and buttons parameters to the dialog:");
$fileFilters = @{
    'Text Documents'     = @('txt', 'log');
    'All Files'          = @('*');
    # You can add more filters here, for example:
    # 'Image Files'        = @('png', 'jpg', 'jpeg');
}
$response = $ui.file_showSave("Save files", $fileFilters, @("!Save", "Cancel"));
$ui.text("You selected:");
$response.result