. "$PSScriptRoot\..\interactive-script-ps.ps1"

$ui.text("You can use the dialog_confirm method to ask for user confirmation.");
$response = $ui.dialog_confirm("Do you like this extension?");

if ($response.result -eq "Yes") {
    $ui.success("Great! Thank you for your feedback.");
} elseif ($response.result -eq "No") {
    $ui.warn("Understood. We'll try to improve!");
}

$ui.log("");
$ui.text("You can pass optional title and buttons parameters to the dialog_confirm method.");
$response = $ui.dialog_confirm("Do you like this extension?", "Feedback", @("Yes", "No", "Maybe"));
$ui.success("You pressed: $($response.result)");