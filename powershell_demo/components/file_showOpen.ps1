. "$PSScriptRoot\..\interactive-script-ps.ps1"

$ui.text("You can call ui.file_showOpen() to render open file input in the Script UI.");
$response = $ui.file_showOpen("Select file");
$ui.text("You selected:");
$response.result

$ui.text("");
$ui.text("You can pass optional CanSelectMany, filters and buttons parameters to the dialog:");
$fileFilters = @{
    'PowerShell Scripts' = @('ps1');
    'All Files'          = @('*');
    # You can add more filters here, for example:
    # 'Text Documents'     = @('txt', 'log');
    # 'Image Files'        = @('png', 'jpg', 'jpeg');
}
$response = $ui.file_showOpen("Select files", $true, $fileFilters, @("!Select", "Cancel"));
$ui.text("You selected:");
$response.result
$ui.text("You have pressed: $($response.resultButton)");