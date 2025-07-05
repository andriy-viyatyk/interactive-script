. "$PSScriptRoot\..\interactive-script-ps.ps1"

$progress = $ui.show_progress("Test progress...", 100);
Start-Sleep -Seconds 1
$progress.UpdateValue(40);
Start-Sleep -Seconds 1
$progress.UpdateValue(60);
$progress.UpdateLabel("New label for progress");
Start-Sleep -Seconds 1
$progress.UpdateValue(100);
$progress.Complete("Progress completed successfully.");
