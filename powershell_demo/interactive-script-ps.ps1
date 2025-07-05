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

function Wait-ForResponse {
    param (
        [Parameter(Mandatory=$true)]
        [string]$CommandId,

        [Parameter(Mandatory=$true)]
        [string]$ExpectedCommand # e.g., "input.confirm"
    )

    while ($true) {
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

# --- New Progress Object Definition ---
function New-ProgressObject {
    param (
        [string]$InitialLabel = "",
        [int]$InitialMax = $null,
        [int]$InitialValue = $null,
        [bool]$InitialCompleted = $false
    )

    $progressObject = New-Object -TypeName PSObject

    # --- KEY FIX: Capture the object itself in a local variable for reliable self-reference ---
    # This variable will be captured by the closures of the script methods.
    $selfRef = $progressObject

    # Internal properties to hold the state and command info
    # Changed: Use -InputObject for Add-Member
    [void](Add-Member -InputObject $progressObject -MemberType NoteProperty -Name "_commandId" -Value (New-Guid))
    [void](Add-Member -InputObject $progressObject -MemberType NoteProperty -Name "_commandType" -Value "output.progress")
    [void](Add-Member -InputObject $progressObject -MemberType NoteProperty -Name "_progressData" -Value ([PSCustomObject]@{
        label = $InitialLabel
        max = $InitialMax
        value = $InitialValue
        completed = $InitialCompleted
    }))

    # --- Internal method to send the update command ---
    # Reference $selfRef instead of $this
    $sendUpdateScript = {
        # Get current progress data via $selfRef
        $currentProgressData = $selfRef._progressData

        # Create the ViewMessage
        $commandMessage = New-ViewMessage -Command $selfRef._commandType -Data $currentProgressData -CommandId $selfRef._commandId -IsEvent $false

        # Serialize and send the command
        $payload = ConvertTo-Json -InputObject $commandMessage -Compress -Depth 10
        Write-Host "[>-command-<] $payload" -NoNewline

        # Return null to prevent implicit output from this internal method
        return $null
    }.GetNewClosure()
    # Changed: Use -InputObject for Add-Member
    [void](Add-Member -InputObject $progressObject -MemberType ScriptMethod -Name "_SendUpdate" -Value $sendUpdateScript)

    # --- Public methods to update properties and send updates ---

    # Getters (read-only properties for simplicity, as setters trigger updates)
    # Reference $selfRef instead of $this
    # Changed: Use -InputObject for Add-Member
    [void](Add-Member -InputObject $progressObject -MemberType ScriptMethod -Name "GetLabel" -Value { return $selfRef._progressData.label; }.GetNewClosure())
    [void](Add-Member -InputObject $progressObject -MemberType ScriptMethod -Name "GetMax" -Value { return $selfRef._progressData.max; }.GetNewClosure())
    [void](Add-Member -InputObject $progressObject -MemberType ScriptMethod -Name "GetValue" -Value { return $selfRef._progressData.value; }.GetNewClosure())
    [void](Add-Member -InputObject $progressObject -MemberType ScriptMethod -Name "IsCompleted" -Value { return $selfRef._progressData.completed; }.GetNewClosure())


    # Setters (update property and send command)
    # Reference $selfRef instead of $this
    # Changed: Use -InputObject for Add-Member
    [void](Add-Member -InputObject $progressObject -MemberType ScriptMethod -Name "UpdateLabel" -Value {
        param([string]$newLabel)
        $selfRef._progressData.label = $newLabel
        [void]$selfRef._SendUpdate() # Ensure _SendUpdate's return is also voided
        # return $selfRef # Return the object itself for chaining
    }.GetNewClosure())

    [void](Add-Member -InputObject $progressObject -MemberType ScriptMethod -Name "UpdateMax" -Value {
        param([int]$newMax)
        $selfRef._progressData.max = $newMax
        [void]$selfRef._SendUpdate()
        # return $selfRef
    }.GetNewClosure())

    [void](Add-Member -InputObject $progressObject -MemberType ScriptMethod -Name "UpdateValue" -Value {
        param([int]$newValue)
        $selfRef._progressData.value = $newValue
        [void]$selfRef._SendUpdate()
        # return $selfRef
    }.GetNewClosure())

    [void](Add-Member -InputObject $progressObject -MemberType ScriptMethod -Name "Complete" -Value {
        param([string]$completeLabel = $null)
        $selfRef._progressData.completed = $true
        if ($completeLabel) {
            $selfRef._progressData.label = $completeLabel
        }
        [void]$selfRef._SendUpdate()
        # return $selfRef
    }.GetNewClosure())

    # --- Initial send of the progress command ---
    [void]$selfRef._SendUpdate()

    # Override ToString() to prevent implicit output of the object itself
    # Changed: Use -InputObject for Add-Member
    [void](Add-Member -InputObject $progressObject -MemberType ScriptMethod -Name "ToString" -Value { return ""; } -Force)

    return $progressObject
}


# --- Create the 'Ui' object and add its methods ---

# Create the Ui object
$script:Ui = New-Object -TypeName PSObject

# Helper function to create a log method for the Ui object
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

    # Changed: Use -InputObject for Add-Member explicitly
    [void](Add-Member -InputObject $script:Ui -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock)
    return $null # Explicitly return null
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

    # Changed: Use -InputObject for Add-Member explicitly
    [void](Add-Member -InputObject $script:Ui -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock)
    return $null # Explicitly return null
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

    # Changed: Use -InputObject for Add-Member explicitly
    [void](Add-Member -InputObject $script:Ui -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock)
    return $null # Explicitly return null
}


# --- New: Add _Add-UiShowProgressMethod ---
function _Add-UiShowProgressMethod {
    param (
        [Parameter(Mandatory=$true)]
        [string]$MethodName,
        [Parameter(Mandatory=$true)]
        [string]$CommandType
    )
    $scriptBlock = {
        param (
            [Parameter(Mandatory=$true)]
            [string]$Label, # Initial label for the progress bar

            [Parameter(Mandatory=$false)]
            [int]$Max = $null, # Optional max value

            [Parameter(Mandatory=$false)]
            [int]$Value = $null # Optional initial value
        )
        # Create a new Progress object. Its constructor will send the initial command.
        return New-ProgressObject -InitialLabel $Label -InitialMax $Max -InitialValue $Value
    }.GetNewClosure()

    # Changed: Use -InputObject for Add-Member explicitly
    [void](Add-Member -InputObject $script:Ui -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock)
    return $null # Explicitly return null
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

# Add the show_progress method to the Ui object
_Add-UiShowProgressMethod -MethodName "show_progress" -CommandType "output.progress"