. "$PSScriptRoot\..\interactive-script-ps.ps1"

$Ui.success("Grid Input Demo")

$Ui.log("")
$Ui.text("You can use Ui.dialog_gridInput() command to display editable grid where user can add, edit and delete rows.")
$Ui.text("User also can paste a range of cells into the grid for example from Excel.")

$result = $Ui.dialog_gridInput(@{
    title = "Grid Input"
    columns = @(
        @{ key = "name"; title = "Name"; width = 200 }
        @{ key = "age"; title = "Age"; width = 100; dataType = "number" }
        @{ key = "role"; title = "Role"; width = 150; options = @("Admin", "User", "Guest") }
        @{ key = "active"; title = "Active"; width = 80; dataType = "boolean" }
    )
    result = @(@{}) # You can add an empty first row here if needed
})

$Ui.log("Grid Input Result:")
$Ui.show_text(
    "Grid Input Result",
    ($result.result | ConvertTo-Json -Depth 10)
)

$Ui.log("")
$Ui.text("You can also provide initial data or data for edit without possibility of adding or deleting rows:")

$result = $Ui.dialog_gridInput(@{
    title = "Grid input" # Replaced styledText with simple string
    columns = @(
        @{ key = "hiddenId"; hidden = $true } # Actually this hidden column isn't needed. Provided id in result will be returned back anyway.
        @{ key = "name"; title = "Name"; width = 200; readonly = $true }
        @{ key = "age"; title = "Age"; width = 100; dataType = "number"; readonly = $true }
        @{ key = "role"; title = "Role"; width = 150; options = @("Admin", "User", "Guest") }
        @{ key = "active"; title = "Active"; width = 80; dataType = "boolean" }
    )
    result = @(
        @{ hiddenId = 1; name = "John Doe"; age = 30; role = "Admin"; active = $true }
        @{ hiddenId = 2; name = "Jane Smith"; age = 25; role = "User"; active = $false }
    )
    editOnly = $true # Only edits without adding or deleting rows
    buttons = @("Cancel", "Save")
})

$Ui.show_text(
    "Editing Result",
    ($result.result | ConvertTo-Json -Depth 10)
)

$Ui.log("You pressed: ")
$Ui.log($result.resultButton)
$Ui.log("")
$Ui.success("End of Demo.")
