. "$PSScriptRoot\..\interactive-script-ps.ps1"

$ui.log("You can display list of objects as a grid in separate VSCode window.");
[void]$ui.dialog_buttons("Show me");

$services = Get-Service | Select-Object -Property Name, Status;
$ui.window_show_grid("Services", $services);