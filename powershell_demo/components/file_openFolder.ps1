. "$PSScriptRoot\..\interactive-script-ps.ps1"

$ui.text("You can call VSCode native folder open dialog with the following command:");
$response = $ui.file_openFolder();
$ui.text("You selected:");
$ui.success("$($response.result)");

$ui.text("");
$ui.text("You can pass optional CanSelectMany parameter to the dialog:");
$response = $ui.file_openFolder($true);
$ui.text("You selected:");
$response.result