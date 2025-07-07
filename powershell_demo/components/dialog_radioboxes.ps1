. "$PSScriptRoot\..\interactive-script-ps.ps1"

$ui.log("You can show a set of radioboxes and read which one was checked.");
$response = $ui.dialog_radioboxes("Select an option", ("one", "two", "three"));
$ui.success("You selected: $($response.result)");

$ui.log("");
$ui.log("You can pass optional buttons to implement Cancel/OK behavior. Use '!' to make a button disabled until radiobox is selected.");
$response = $ui.dialog_radioboxes(
    "Select an option",
    ("one", "two", "three"),
    ("Cancel", "!OK")
);
$ui.success("You selected: $($response.result)");
$ui.info("You pressed: $($response.resultButton)");

$ui.log("");
$ui.log("You can pass many radioboxes.");
$manyRadioboxes = for ($i = 1; $i -le 100; $i++) {
    "Radiobox $i"
}
$response = $ui.dialog_radioboxes("Select an option", $manyRadioboxes);
$ui.success("You selected: $($response.result)");

$ui.log("");
$ui.log("You can pass bodyStyles to align radioboxes for example in a grid.");
$response = $ui.dialog_radioboxes(
    "Select an option",
    $manyRadioboxes,
    $null,
    @{
        display = "grid";
        gridTemplateColumns = "repeat(4, 1fr)";
        gap = "10px";
    }
);
$ui.success("You selected: $($response.result)");