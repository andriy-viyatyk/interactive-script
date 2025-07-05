. "$PSScriptRoot\..\interactive-script-ps.ps1"

$progress = $ui.show_progress("Test progress...");
Start-Sleep -Seconds 1 
$progress.UpdateLabel("New label for progress");
Start-Sleep -Seconds 1 
$progress.Complete("Progress completed successfully.");
