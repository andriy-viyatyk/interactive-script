. "$PSScriptRoot\interactive-script-ps.ps1"

$simpleData = @(
    [PSCustomObject]@{label = "one"; value = 1},
    [PSCustomObject]@{label = "two"; value = 2},
    [PSCustomObject]@{label = "three"; value = 3},
    [PSCustomObject]@{label = "four"; value = 4; Description = "This is the fourth item."} 
)

$simpleData | Format-Table -AutoSize

# $selectedServiceDataSingle = $ui.dialog_select_record(
#     "Select a record", 
#     $simpleData,
#     $false
# )