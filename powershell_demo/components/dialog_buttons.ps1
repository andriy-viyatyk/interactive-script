. "$PSScriptRoot\..\interactive-script-ps.ps1"

$ui.log("You can show set of buttons and read which one was clicked.");
$response = $ui.dialog_buttons(("one", "two", "three"));
$ui.success("You clicked: $($response.result)");

$ui.log("");
$ui.log("You can display many buttons.");

$manyButtons = for ($i = 1; $i -le 100; $i++) {
    "Button $i"
}

$response = $ui.dialog_buttons($manyButtons);
$ui.success("You clicked: $($response.result)");

$ui.log("");
$ui.log("You can pass bodyStyles to align buttons for example in a grid.");
$response = $ui.dialog_buttons(
    $manyButtons,
    @{
        display = "grid";
        gridTemplateColumns = "repeat(4, 1fr)";
        gap = "10px";
    }
);
$ui.success("You clicked: $($response.result)");