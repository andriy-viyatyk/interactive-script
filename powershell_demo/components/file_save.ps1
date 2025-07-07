. "$PSScriptRoot\..\interactive-script-ps.ps1"

$ui.text("You can open VSCode native file save dialog with the following command:");
$response = $ui.file_save();
$ui.text("You selected:");
$ui.success("$($response.result)");

$ui.text("");
$ui.text("You can pass optional filters parameter to the dialog:");
$fileFilters = @{
    'Text Documents'     = @('txt', 'log');
    'All Files'          = @('*');
    # You can add more filters here, for example:
    # 'Image Files'        = @('png', 'jpg', 'jpeg');
}
$response = $ui.file_save($fileFilters);
$ui.text("You selected:");
$ui.success("$($response.result)");