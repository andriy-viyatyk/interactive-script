. "$PSScriptRoot\..\interactive-script-ps.ps1"

$ui.log("You can show a set of checkboxes and read which ones were checked.");
$response = $ui.dialog_checkboxes("Select options", ("one", "two", "three"));
$ui.success("You checked: $($response.result -join ', ')");

$ui.log("");
$ui.log("You can pass optional buttons to implement Cancel/OK behavior. Use '!' to make a button disabled until checkbox is checked.");
$response = $ui.dialog_checkboxes(
    "Select options",
    ("one", "two", "three"),
    ("Cancel", "!OK")
);
$ui.success("You checked: $($response.result -join ', ')");
$ui.info("You pressed: $($response.resultButton)");

$ui.log("");
$ui.log("You can pass many checkboxes.");
$manyCheckboxes = for ($i = 1; $i -le 100; $i++) {
    "Checkbox $i"
}
$response = $ui.dialog_checkboxes("Select options", $manyCheckboxes);
$ui.success("You checked: $($response.result -join ', ')");

$ui.log("");
$ui.log("You can pass bodyStyles to align checkboxes for example in a grid.");
$response = $ui.dialog_checkboxes(
    "Select options",
    $manyCheckboxes,
    $null,
    @{
        display = "grid";
        gridTemplateColumns = "repeat(4, 1fr)";
        gap = "10px";
    }
);
$ui.success("You checked: $($response.result -join ', ')");