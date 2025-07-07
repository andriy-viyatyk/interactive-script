. "$PSScriptRoot\..\interactive-script-ps.ps1"

Write-Host "Fetching Windows services..."
$services = Get-Service | Select-Object -Property Name, Status, DisplayName

# --- First dialog_select_record: Single Selection ---
Write-Host "`n--- Demo 1: Single Service Selection ---"
$ui.Log("Please select one service from the list that appears.")
$selectedServiceDataSingle = $ui.dialog_select_record(
    "Select a Windows Service (Single Select)", # Title for the selection grid
    $services,                                 # The array of objects (services) to display
    $false                                     # Explicitly set to $false for single selection
)

# Print the single selected record
$selectedRecordSingle = $selectedServiceDataSingle.result | Select-Object -First 1
$ui.Info("You selected the following service (Single Select):")
$selectedRecordSingle | Format-List

<# -------------------------------------------------------------------------------------------------------------------- #>

# --- Second dialog_select_record: Multi-Selection ---
Write-Host "`n--- Demo 2: Multiple Services Selection ---"
$ui.Log("Now, please select multiple services from the list that appears.")
$selectedServiceDataMultiple = $ui.dialog_select_record(
    "Select Windows Services (Multi-Select)", # Title for the selection grid
    $services,                               # The array of objects (services) to display
    $true                                    # Set to $true for multi-selection
)

# Print all selected records
$selectedRecordsMultiple = $selectedServiceDataMultiple.result
$ui.Info("You selected the following services (Multi-Select):")

if ($selectedRecordsMultiple -and $selectedRecordsMultiple.Count -gt 0) {
    # If multiple records are selected, Format-Table is usually better for readability
    $selectedRecordsMultiple | Format-Table -AutoSize
} else {
    $ui.Warn("No services were selected in multi-select mode, or the operation was cancelled.")
}

Write-Host "`nDemo script finished."