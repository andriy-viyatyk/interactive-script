. "$PSScriptRoot\..\interactive-script-ps.ps1"

$ui.log("You can show inline select component with the following command:")
$response = $ui.inline_select("Select an option:", ("Option 1", "Option 2", "Option 3"));
$ui.log("You selected: $($response.result)");

$ui.log("");
$ui.log("You can pass optional buttons to the inline select:");
$response = $ui.inline_select("Select an option:", ("Option 1", "Option 2", "Option 3"), $null, ("Cancel", "!OK"));
$ui.log("You selected: $($response.result)");
$ui.info("You pressed: $($response.resultButton)");

$ui.log("");
$ui.log("You can pass list of objects as an options and provide labelKey for option label:");
$services = Get-Service | Select-Object -Property Name, Status;
$response = $ui.inline_select("Select a service:", $services, "Name");
$ui.log("You selected: $($response.result)");
