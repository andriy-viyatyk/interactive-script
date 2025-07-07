. "$PSScriptRoot\..\interactive-script-ps.ps1"

$ui.text("You can call ui.file_showOpenFolder() to render open folder input in the Script UI.");
$response = $ui.file_showOpenFolder("Select folder");
$ui.text("You selected:");
$response.result

$ui.text("");
$ui.text("You can pass optional CanSelectMany and buttons parameters to the dialog:");
$response = $ui.file_showOpenFolder("Select folders", $true, @("!Select", "Cancel"));
$ui.text("You selected:");
$response.result
$ui.text("You have pressed: $($response.resultButton)");