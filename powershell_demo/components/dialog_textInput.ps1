. "$PSScriptRoot\..\interactive-script-ps.ps1"

$ui.log("You can show text input dialog with the following command:")
$response = $ui.dialog_textInput("Enter your name:");
$ui.log("You entered: $($response.result)");

$ui.log("");
$ui.log("You can pass optional buttons and initial text to the dialog:");
$response = $ui.dialog_textInput("Enter your name:", ("Cancel", "!OK"), "John Doe");
$ui.log("You entered: $($response.result)");
$ui.info("You pressed: $($response.resultButton)");