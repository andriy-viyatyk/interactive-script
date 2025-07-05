. "$PSScriptRoot\..\interactive-script-ps.ps1"

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


$processesData = Get-Process | Select-Object -Property @{Name='ProcessName'; Expression={$_.ProcessName}},
    @{Name='Memory (KB)'; Expression={($_.WS / 1KB).ToString("N0")}},
    @{Name='CPU (Seconds)'; Expression={$_.CPU}},
    @{Name='ImagePath'; Expression={$_.Path}}


$ui.show_grid("Running Processes Details", $processesData)


$tcpConnections = Get-NetTCPConnection | Select-Object -Property Protocol,
    LocalAddress,
    LocalPort,
    RemoteAddress,
    RemotePort,
    State,
    OwningProcess # This is the PID


$udpEndpoints = Get-NetUDPEndpoint | Select-Object -Property Protocol,
    LocalAddress,
    LocalPort,
    OwningProcess # This is the PID

$netstatData = @()

# Process TCP connections
foreach ($conn in $tcpConnections) {
    $process = $null
    $processName = "N/A"
    $imagePath = "N/A"

    # Try to get process details using OwningProcess (PID)
    try {
        $process = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
        if ($process) {
            $processName = $process.ProcessName
            $imagePath = $process.Path
        }
    }
    catch {} # Catch errors if process no longer exists or is inaccessible

    $netstatData += [PSCustomObject]@{
        Protocol      = $conn.Protocol
        LocalAddress  = $conn.LocalAddress
        LocalPort     = $conn.LocalPort
        RemoteAddress = $conn.RemoteAddress
        RemotePort    = $conn.RemotePort
        State         = $conn.State # Only applicable for TCP
        ProcessName   = $processName
        ImagePath     = $imagePath
    }
}

# Process UDP endpoints
foreach ($endpoint in $udpEndpoints) {
    $process = $null
    $processName = "N/A"
    $imagePath = "N/A"

    # Try to get process details using OwningProcess (PID)
    try {
        $process = Get-Process -Id $endpoint.OwningProcess -ErrorAction SilentlyContinue
        if ($process) {
            $processName = $process.ProcessName
            $imagePath = $process.Path
        }
    }
    catch {} # Catch errors if process no longer exists or is inaccessible

    $netstatData += [PSCustomObject]@{
        Protocol      = $endpoint.Protocol
        LocalAddress  = $endpoint.LocalAddress
        LocalPort     = $endpoint.LocalPort
        RemoteAddress = "" # UDP doesn't have a specific remote address for an "endpoint"
        RemotePort    = ""
        State         = "LISTENING" # UDP endpoints are typically listening
        ProcessName   = $processName
        ImagePath     = $imagePath
    }
}

$ui.show_grid("Network Connections & Open Ports", $netstatData)