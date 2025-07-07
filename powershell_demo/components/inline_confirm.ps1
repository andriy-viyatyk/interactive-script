. "$PSScriptRoot\..\interactive-script-ps.ps1"

$ui.text("You can use the inline_confirm method to ask for user confirmation.");
$response = $ui.inline_confirm("Do you like this extension?");

if ($response.result -eq "Yes") {
    $ui.success("Great! Thank you for your feedback.");
} elseif ($response.result -eq "No") {
    $ui.warn("Understood. We'll try to improve!");
}

$ui.log("");
$ui.text("You can pass optional buttons parameters to the inline_confirm method.");
$response = $ui.inline_confirm("Do you like this extension?", @("Yes", "No", "Maybe"));
$ui.success("You pressed: $($response.result)");