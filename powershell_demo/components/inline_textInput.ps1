. "$PSScriptRoot\..\interactive-script-ps.ps1"

$ui.log("You can show inline text input component with the following command:")
$response = $ui.inline_textInput("Enter your name:");
$ui.log("You entered: $($response.result)");

$ui.log("");
$ui.log("You can pass optional buttons and initial text to the inline text input:");
$response = $ui.inline_textInput("Enter your name:", ("Cancel", "!OK"), "John Doe");
$ui.log("You entered: $($response.result)");
$ui.info("You pressed: $($response.resultButton)");