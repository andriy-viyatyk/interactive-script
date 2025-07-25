. "$PSScriptRoot\..\interactive-script-ps.ps1"

$ui.log("You can show inline date input component with the following command:");
$response = $ui.inline_dateInput("Select a date:");
$ui.log("You selected: $($response.result)");

$ui.log("");
$ui.log("You can pass optional buttons and initial date to the component:");
$response = $ui.inline_dateInput("Select a date:", ("Cancel", "!OK"), "2023-01-01");
$ui.log("You selected: $($response.result)");
$ui.info("You pressed: $($response.resultButton)");