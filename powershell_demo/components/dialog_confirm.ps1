. "$PSScriptRoot\..\interactive-script-ps.ps1"

$response = $ui.dialog_confirm("Do you like this extension?", "Confirmation");

if ($response.result -eq "Yes") {
    $ui.success("Great! Thank you for your feedback.").print();
} elseif ($response.result -eq "No") {
    $ui.warn("Understood. We'll try to improve!").print();
} else {
    # This handles cases like dialog being closed without a button click, etc.
    $ui.info("Dialog closed without a selection.").print();
}