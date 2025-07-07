. "$PSScriptRoot\..\interactive-script-ps.ps1"

$ui.text("You can call VSCode native file open dialog with the following command:");
$response = $ui.file_open();
$ui.text("You selected:");
$ui.success("$($response.result)");

$ui.text("");
$ui.text("You can pass optional CanSelectMany and filters parameters to the dialog:");
$fileFilters = @{
    'PowerShell Scripts' = @('ps1');
    'All Files'          = @('*');
    # You can add more filters here, for example:
    # 'Text Documents'     = @('txt', 'log');
    # 'Image Files'        = @('png', 'jpg', 'jpeg');
}
$response = $ui.file_open($true, $fileFilters);
$ui.text("You selected:");
$ui.success("$($response.result)");