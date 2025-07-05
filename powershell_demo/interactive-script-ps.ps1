# interactive_script_powershell_lib.ps1

# Helper function to generate a new GUID
function New-Guid {
    [guid]::NewGuid().ToString()
}

# PowerShell analogue of TypeScript's newMessage function
function New-ViewMessage {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Command,

        [object]$Data = $null, # Data can be any type, default to null
        [string]$CommandId = (New-Guid), # Default to a new GUID if not provided
        [bool]$IsEvent = $false # Default to false if not provided
    )

    # Explicitly create a PSCustomObject for the view message itself
    $viewMessage = [PSCustomObject]@{
        command = $Command
        commandId = $CommandId
        data = $Data
        isEvent = $IsEvent
    }

    return $viewMessage
}

# The New-TextWithStyle and styledText functions have been entirely removed.

function Wait-ForResponse {
    param (
        [Parameter(Mandatory=$true)]
        [string]$CommandId,

        [Parameter(Mandatory=$true)]
        [string]$ExpectedCommand # e.g., "input.confirm"
    )

    # PowerShell doesn't have a direct equivalent of 'await' for stdin.
    # We'll poll stdin in a loop until we get the expected response.
    # IMPORTANT: This is a blocking loop. For long-running scripts, consider
    # incorporating a timeout or a more sophisticated non-blocking read if your host supports it.
    while ($true) {
        # Read a line from stdin. In a typical interactive script environment,
        # this will block until a line is available.
        $inputLine = Read-Host

        # Check if the line is a command response
        if ($inputLine.StartsWith("[>-command-<]")) {
            # Extract the JSON payload
            $jsonPayload = $inputLine.Substring("[>-command-<]".Length).Trim()

            try {
                $responseObject = ConvertFrom-Json $jsonPayload

                # Check if it's the response we're waiting for
                if ($responseObject.commandId -eq $CommandId -and $responseObject.command -eq $ExpectedCommand) {
                    return $responseObject.data # Return the 'data' part of the response
                }
            }
            catch {
                # Log parsing errors, but don't stop; keep waiting for the correct response
                Write-Error "Failed to parse JSON response from stdin: $($_.Exception.Message)"
            }
        }
    }
}

# --- Create the 'Ui' object and add its methods ---

# Create the Ui object
$script:Ui = New-Object -TypeName PSObject

# Helper script block to create a log method for the Ui object
function _Add-UiLogMethod {
    param (
        [Parameter(Mandatory=$true)]
        [string]$MethodName,
        [Parameter(Mandatory=$true)]
        [string]$CommandType
    )
    $scriptBlock = {
        param (
            [Parameter(Mandatory=$true)]
            [string]$Message # Now directly accepts a string
        )
        # Create a New-ViewMessage directly for the log command
        $commandMessage = New-ViewMessage -Command $CommandType -Data $Message -IsEvent $false

        # Serialize and send the command directly via Write-Host
        $payload = ConvertTo-Json -InputObject $commandMessage -Compress -Depth 10 # Adjust depth as needed
        Write-Host "[>-command-<] $payload" -NoNewline

        # Return null as log commands are fire-and-forget
        return $null
    }.GetNewClosure()

    $script:Ui | Add-Member -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock
}

function _Add-UiConfirmMethod {
    param (
        [Parameter(Mandatory=$true)]
        [string]$MethodName,
        [Parameter(Mandatory=$true)]
        [string]$CommandType
    )
    $scriptBlock = {
        param (
            [Parameter(Mandatory=$true)]
            [string]$Message, # Corresponds to ConfirmData.message
            [string]$Title = $null, # Corresponds to ConfirmData.title
            [string[]]$Buttons = $null # Corresponds to ConfirmData.buttons
        )

        # 1. Prepare the data for the command
        $confirmData = [PSCustomObject]@{
            message = $Message
        }

        if ($Title) {
            $confirmData | Add-Member -MemberType NoteProperty -Name "title" -Value $Title -Force
        }
        if ($Buttons -and $Buttons.Count -gt 0) {
            $confirmData | Add-Member -MemberType NoteProperty -Name "buttons" -Value $Buttons -Force
        }

        # 2. Create the ViewMessage for input.confirm
        $commandMessage = New-ViewMessage -Command $CommandType -Data $confirmData -IsEvent $false

        # Extract the commandId for waiting
        $commandId = $commandMessage.commandId

        # 3. Manually construct JSON payload and send it via Write-Host -NoNewline
        # We need to manually serialize to JSON because New-ViewMessage returns PSCustomObject
        # and we need a raw string for Write-Host.
        $payload = ConvertTo-Json -InputObject $commandMessage -Compress -Depth 10 # Adjust depth as needed

        Write-Host "[>-command-<] $payload" -NoNewline # Send the command to the extension

        # 4. Wait for the response from the extension via stdin
        $response = Wait-ForResponse -CommandId $commandId -ExpectedCommand $CommandType

        return $response # This will be the 'result' property (e.g., button label)
    }.GetNewClosure()

    $script:Ui | Add-Member -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock
}

function _Add-UiShowGridMethod {
    param (
        [Parameter(Mandatory=$true)]
        [string]$MethodName,
        [Parameter(Mandatory=$true)]
        [string]$CommandType
    )
    $scriptBlock = {
        param (
            [Parameter(Mandatory=$false)] # Title can be optional
            [string]$Title = $null, # This parameter will now *always* be a string

            [Parameter(Mandatory=$true)]
            [array]$Data # Expects an array of objects
        )

        # Prepare the data for the command
        $gridData = [PSCustomObject]@{
            data = $Data # Pass the raw PowerShell array here. ConvertTo-Json will handle it.
        }

        # Directly use the provided $Title string if it's not null or empty
        if (-not [string]::IsNullOrEmpty($Title)) {
            $gridData | Add-Member -MemberType NoteProperty -Name "title" -Value $Title -Force
        }

        # Create the ViewMessage for output.grid
        $commandMessage = New-ViewMessage -Command $CommandType -Data $gridData -IsEvent $false

        # Manually construct JSON payload and send it via Write-Host -NoNewline
        $payload = ConvertTo-Json -InputObject $commandMessage -Compress -Depth 10 # Adjust depth as needed

        Write-Host "[>-command-<] $payload" -NoNewline

        # show_grid typically doesn't expect a direct response, so return null.
        return $null
    }.GetNewClosure()

    $script:Ui | Add-Member -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock
}

# Add all log methods to the Ui object
_Add-UiLogMethod -MethodName "Log" -CommandType "log.log"
_Add-UiLogMethod -MethodName "Text" -CommandType "log.text"
_Add-UiLogMethod -MethodName "Info" -CommandType "log.info"
_Add-UiLogMethod -MethodName "Warn" -CommandType "log.warn"
_Add-UiLogMethod -MethodName "Error" -CommandType "log.error"
_Add-UiLogMethod -MethodName "Success" -CommandType "log.success"

# Add the dialog_confirm method to the Ui object
_Add-UiConfirmMethod -MethodName "dialog_confirm" -CommandType "input.confirm"

# Add the show_grid method to the Ui object
_Add-UiShowGridMethod -MethodName "show_grid" -CommandType "output.grid"