. "$PSScriptRoot\..\interactive-script-ps.ps1"

$ui.log("You can show a grid with an array of objects using the `show_grid` method.");
$simpleData = @(
    [PSCustomObject]@{label = "one"; value = 1},
    [PSCustomObject]@{label = "two"; value = 2},
    [PSCustomObject]@{label = "three"; value = 3},
    [PSCustomObject]@{label = "four"; value = 4; Description = "This is the fourth item."} # You can add extra properties too!
)

# Pass the array of objects to show_grid
$ui.show_grid("Simple Explicit List", $simpleData)
$ui.log("");

$ui.log("Also you can use some list of objects returned by powershell commands, like Get-Service, Get-Process, etc.");
$services = Get-Service | Select-Object -Property Name,
    Status,
    DisplayName,
    @{Name='ImagePath'; Expression={
        try {
            # Services path is stored in HKLM:\SYSTEM\CurrentControlSet\Services\<ServiceName>
            (Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\$($_.Name)").ImagePath
        }
        catch {
            # Return an empty string or null if the path can't be found (e.g., for virtual services)
            ""
        }
    }}
$ui.show_grid("Windows Services List", $services)

