# interactive_script_ps.ps1

<#
.SYNOPSIS
    PowerShell client library for the Interactive Script Visual Studio Code extension.

.DESCRIPTION
    This PowerShell script provides a set of functions and a 'Ui' object to enable
    communication between PowerShell scripts and the "Interactive Script" Visual Studio Code extension.
    It allows PowerShell scripts to interact with the extension's UI components,
    such as displaying logs, confirmations, grids, text, and progress bars.

    Designed to be used in conjunction with the [Interactive Script](https://marketplace.visualstudio.com/items?itemName=andriy-viyatyk.interactive-script)
    extension for Visual Studio Code.

.LINK
    For detailed documentation, examples, and usage instructions, please visit the
    [project repository](https://github.com/andriy-viyatyk/interactive-script).

.NOTES
    Author: Andriy Viyatyk
    Version: 1.0.0
    Date: July 5, 2025
    License: ISC
#>

# Set the output encoding for the current PowerShell session to UTF8 without BOM
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)

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
        $inputLine = [Console]::In.ReadLine() # Read-Host is producing duplicated output in stdout

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
    }.GetNewClosure())

    [void](Add-Member -InputObject $progressObject -MemberType ScriptMethod -Name "UpdateMax" -Value {
        param([int]$newMax)
        $selfRef._progressData.max = $newMax
        [void]$selfRef._SendUpdate()
    }.GetNewClosure())

    [void](Add-Member -InputObject $progressObject -MemberType ScriptMethod -Name "UpdateValue" -Value {
        param([int]$newValue)
        $selfRef._progressData.value = $newValue
        [void]$selfRef._SendUpdate()
    }.GetNewClosure())

    [void](Add-Member -InputObject $progressObject -MemberType ScriptMethod -Name "Complete" -Value {
        param([string]$completeLabel = $null)
        $selfRef._progressData.completed = $true
        if ($completeLabel) {
            $selfRef._progressData.label = $completeLabel
        }
        [void]$selfRef._SendUpdate()
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

# --- Add _Add-UiSelectRecordMethod for input.selectRecord ---
function _Add-UiSelectRecordMethod {
    param (
        [Parameter(Mandatory=$true)]
        [string]$MethodName,
        [Parameter(Mandatory=$true)]
        [string]$CommandType
    )
    $scriptBlock = {
        param (
            [Parameter(Mandatory=$true)]
            [string]$Title, # Equivalent to 'title?: UiText'
            [Parameter(Mandatory=$true)]
            [array]$Records, # Equivalent to 'records: any[]' in TypeScript
            [bool]$Multiple = $false, # Equivalent to 'multiple?: boolean'
            [string[]]$Buttons = $null # Equivalent to 'buttons?: UiText[]'
        )

        # Prepare the data for the command
        $selectRecordData = [PSCustomObject]@{
            records = $Records
            multiple = $Multiple
        }

        if (-not [string]::IsNullOrEmpty($Title)) {
            $selectRecordData | Add-Member -MemberType NoteProperty -Name "title" -Value $Title -Force
        }
        if ($Buttons -and $Buttons.Count -gt 0) {
            $selectRecordData | Add-Member -MemberType NoteProperty -Name "buttons" -Value $Buttons -Force
        }

        # Create the ViewMessage for input.selectRecord
        $commandMessage = New-ViewMessage -Command $CommandType -Data $selectRecordData -IsEvent $false

        # Extract the commandId for waiting
        $commandId = $commandMessage.commandId

        # Manually construct JSON payload and send it via Write-Host -NoNewline
        $payload = ConvertTo-Json -InputObject $commandMessage -Compress -Depth 10

        Write-Host "[>-command-<] $payload" -NoNewline

        # Wait for the response from the extension via stdin
        # The response will contain 'result' (selected records) and 'resultButton'
        $response = Wait-ForResponse -CommandId $commandId -ExpectedCommand $CommandType

        return $response # This will be the object containing result and resultButton
    }.GetNewClosure()

    # Changed: Use -InputObject for Add-Member explicitly
    [void](Add-Member -InputObject $script:Ui -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock)
    return $null # Explicitly return null
}

# --- New: Add _Add-UiShowTextMethod for output.text ---
function _Add-UiShowTextMethod {
    param (
        [Parameter(Mandatory=$true)]
        [string]$MethodName,
        [Parameter(Mandatory=$true)]
        [string]$CommandType
    )
    $scriptBlock = {
        param (
            [Parameter(Mandatory=$true)]
            [string]$Title, # Corrected: Comma after Title
            [Parameter(Mandatory=$true)]
            [string]$Text  # Corrected: No trailing comma after Text
        )

        # Prepare the data for the command
        $textData = [PSCustomObject]@{
            text = $Text;  # Corrected: Semicolon or new line, not comma for object properties
            title = $Title
        }

        # Create the ViewMessage for output.text
        $commandMessage = New-ViewMessage -Command $CommandType -Data $textData -IsEvent $false

        # Manually construct JSON payload and send it via Write-Host -NoNewline
        $payload = ConvertTo-Json -InputObject $commandMessage -Compress -Depth 10

        Write-Host "[>-command-<] $payload" -NoNewline

        # show_text typically doesn't expect a direct response, so return null.
        return $null
    }.GetNewClosure()

    # Changed: Use -InputObject for Add-Member explicitly
    [void](Add-Member -InputObject $script:Ui -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock)
    return $null # Explicitly return null
}


# --- New: Add _Add-UiButtonsMethod for input.buttons ---
function _Add-UiButtonsMethod {
    param (
        [Parameter(Mandatory=$true)]
        [string]$MethodName,
        [Parameter(Mandatory=$true)]
        [string]$CommandType
    )
    $scriptBlock = {
        param (
            [Parameter(Mandatory=$true)]
            [string[]]$Buttons, # Expects an array of strings for button labels

            [Parameter(Mandatory=$false)]
            [object]$BodyStyles = $null # Optional object for bodyStyles
        )

        # Prepare the data for the command
        $buttonsData = [PSCustomObject]@{
            buttons = $Buttons
        }

        if ($BodyStyles) {
            # Add bodyStyles if provided. ConvertTo-Json will handle its serialization.
            $buttonsData | Add-Member -MemberType NoteProperty -Name "bodyStyles" -Value $BodyStyles -Force
        }

        # Create the ViewMessage for input.buttons
        $commandMessage = New-ViewMessage -Command $CommandType -Data $buttonsData -IsEvent $false

        # Extract the commandId for waiting
        $commandId = $commandMessage.commandId

        # Manually construct JSON payload and send it via Write-Host -NoNewline
        $payload = ConvertTo-Json -InputObject $commandMessage -Compress -Depth 10

        Write-Host "[>-command-<] $payload" -NoNewline

        # Wait for the response from the extension via stdin
        # The response will contain the 'result' property with the label of the clicked button.
        $response = Wait-ForResponse -CommandId $commandId -ExpectedCommand $CommandType

        return $response # This will be the 'result' property (the clicked button's label)
    }.GetNewClosure()

    [void](Add-Member -InputObject $script:Ui -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock)
    return $null
}

# --- New: Add _Add-UiCheckboxesMethod for input.checkboxes ---
function _Add-UiCheckboxesMethod {
    param (
        [Parameter(Mandatory=$true)]
        [string]$MethodName,
        [Parameter(Mandatory=$true)]
        [string]$CommandType
    )
    $scriptBlock = {
        param (
            [Parameter(Mandatory=$true)]
            [string]$Title, # Corresponds to CheckboxesData.title

            [Parameter(Mandatory=$true)]
            [string[]]$Items, # Array of strings, to be mapped to CheckboxItem[]

            [Parameter(Mandatory=$false)]
            [string[]]$Buttons = $null, # Optional array of strings for buttons

            [Parameter(Mandatory=$false)]
            [object]$BodyStyles = $null # Optional object for bodyStyles
        )

        # Map the array of strings to an array of CheckboxItem objects { label: string }
        $checkboxItems = $Items | ForEach-Object {
            [PSCustomObject]@{
                label = $_
                # checked = $false # 'checked' is optional in TS, so we can omit it or set default
            }
        }

        # Prepare the data for the command
        $checkboxesData = [PSCustomObject]@{
            title = $Title
            items = $checkboxItems
        }

        if ($Buttons -and $Buttons.Count -gt 0) {
            $checkboxesData | Add-Member -MemberType NoteProperty -Name "buttons" -Value $Buttons -Force
        }
        if ($BodyStyles) {
            $checkboxesData | Add-Member -MemberType NoteProperty -Name "bodyStyles" -Value $BodyStyles -Force
        }

        # Create the ViewMessage for input.checkboxes
        $commandMessage = New-ViewMessage -Command $CommandType -Data $checkboxesData -IsEvent $false

        # Extract the commandId for waiting
        $commandId = $commandMessage.commandId

        # Manually construct JSON payload and send it via Write-Host -NoNewline
        $payload = ConvertTo-Json -InputObject $commandMessage -Compress -Depth 10

        Write-Host "[>-command-<] $payload" -NoNewline

        # Wait for the response from the extension via stdin
        # The response will contain 'result' (array of checked item labels)
        # and 'resultButton' (label of clicked button)
        $response = Wait-ForResponse -CommandId $commandId -ExpectedCommand $CommandType

        return $response # This will be the object containing result and resultButton
    }.GetNewClosure()

    [void](Add-Member -InputObject $script:Ui -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock)
    return $null
}

# --- New: Add _Add-UiRadioboxesMethod for input.radioboxes ---
function _Add-UiRadioboxesMethod {
    param (
        [Parameter(Mandatory=$true)]
        [string]$MethodName,
        [Parameter(Mandatory=$true)]
        [string]$CommandType
    )
    $scriptBlock = {
        param (
            [Parameter(Mandatory=$true)]
            [string]$Title, # Corresponds to RadioboxesData.title

            [Parameter(Mandatory=$true)]
            [string[]]$Items, # Array of strings, directly maps to UiText[]

            [Parameter(Mandatory=$false)]
            [string[]]$Buttons = $null, # Optional array of strings for buttons

            [Parameter(Mandatory=$false)]
            [object]$BodyStyles = $null # Optional object for bodyStyles
        )

        # Prepare the data for the command
        # For RadioboxesData, 'items' is UiText[], and UiText can be a string, so direct use is fine.
        $radioboxesData = [PSCustomObject]@{
            title = $Title
            items = $Items
        }

        if ($Buttons -and $Buttons.Count -gt 0) {
            $radioboxesData | Add-Member -MemberType NoteProperty -Name "buttons" -Value $Buttons -Force
        }
        if ($BodyStyles) {
            $radioboxesData | Add-Member -MemberType NoteProperty -Name "bodyStyles" -Value $BodyStyles -Force
        }

        # Create the ViewMessage for input.radioboxes
        $commandMessage = New-ViewMessage -Command $CommandType -Data $radioboxesData -IsEvent $false

        # Extract the commandId for waiting
        $commandId = $commandMessage.commandId

        # Manually construct JSON payload and send it via Write-Host -NoNewline
        $payload = ConvertTo-Json -InputObject $commandMessage -Compress -Depth 10

        Write-Host "[>-command-<] $payload" -NoNewline

        # Wait for the response from the extension via stdin
        # The response will contain 'result' (the label of the selected option)
        # and 'resultButton' (label of clicked button)
        $response = Wait-ForResponse -CommandId $commandId -ExpectedCommand $CommandType

        return $response # This will be the object containing result and resultButton
    }.GetNewClosure()

    [void](Add-Member -InputObject $script:Ui -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock)
    return $null
}

# --- New: Add _Add-UiTextInputMethod for input.text ---
function _Add-UiTextInputMethod {
    param (
        [Parameter(Mandatory=$true)]
        [string]$MethodName,
        [Parameter(Mandatory=$true)]
        [string]$CommandType
    )
    $scriptBlock = {
        param (
            [Parameter(Mandatory=$true)]
            [string]$Title, # Corresponds to TextInputData.title

            [Parameter(Mandatory=$false)]
            [string[]]$Buttons = $null, # Optional array of strings for buttons

            [Parameter(Mandatory=$false)]
            [string]$InitialText = $null # Optional initial text for the input field
        )

        # Prepare the data for the command
        $textInputData = [PSCustomObject]@{
            title = $Title
        }

        if ($Buttons -and $Buttons.Count -gt 0) {
            $textInputData | Add-Member -MemberType NoteProperty -Name "buttons" -Value $Buttons -Force
        }
        if ($InitialText) {
            $textInputData | Add-Member -MemberType NoteProperty -Name "result" -Value $InitialText -Force # 'result' is used for initial text in TS def
        }

        # Create the ViewMessage for input.text
        $commandMessage = New-ViewMessage -Command $CommandType -Data $textInputData -IsEvent $false

        # Extract the commandId for waiting
        $commandId = $commandMessage.commandId

        # Manually construct JSON payload and send it via Write-Host -NoNewline
        $payload = ConvertTo-Json -InputObject $commandMessage -Compress -Depth 10

        Write-Host "[>-command-<] $payload" -NoNewline

        # Wait for the response from the extension via stdin
        # The response will contain 'result' (the text user typed)
        # and 'resultButton' (label of clicked button)
        $response = Wait-ForResponse -CommandId $commandId -ExpectedCommand $CommandType

        return $response # This will be the object containing result and resultButton
    }.GetNewClosure()

    [void](Add-Member -InputObject $script:Ui -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock)
    return $null
}

# --- New: Add _Add-UiInputDateMethod for input.date ---
function _Add-UiInputDateMethod {
    param (
        [Parameter(Mandatory=$true)]
        [string]$MethodName,
        [Parameter(Mandatory=$true)]
        [string]$CommandType
    )
    $scriptBlock = {
        param (
            [Parameter(Mandatory=$true)]
            [string]$Title, # Corresponds to DateInputData.title

            [Parameter(Mandatory=$false)]
            [string[]]$Buttons = $null, # Optional array of strings for buttons

            [Parameter(Mandatory=$false)]
            [object]$InitialDate = $null # Can be a [datetime] object or a string
        )

        # Prepare the data for the command
        $dateInputData = [PSCustomObject]@{
            title = $Title
        }

        if ($Buttons -and $Buttons.Count -gt 0) {
            $dateInputData | Add-Member -MemberType NoteProperty -Name "buttons" -Value $Buttons -Force
        }

        $parsedDateTime = $null # Initialize a variable to hold the parsed datetime

        # If InitialDate is a string, attempt to parse it
        if ($InitialDate -is [string] -and -not [string]::IsNullOrEmpty($InitialDate)) {
            try {
                # Attempt to parse the string into a DateTime object.
                # AdjustToUniversal will convert the parsed date to UTC if it has timezone info.
                $parsedDateTime = [datetime]::Parse($InitialDate, $null, [System.Globalization.DateTimeStyles]::AdjustToUniversal)
            }
            catch {
                Write-Warning "Could not parse '$InitialDate' as a date string for initial date: $($_.Exception.Message)"
                # If parsing fails, $parsedDateTime remains $null, so no initial date will be sent.
            }
        }
        # If InitialDate was already a [datetime] object, use it directly
        elseif ($InitialDate -is [datetime]) {
            $parsedDateTime = $InitialDate
        }

        # If a valid datetime object was obtained (either passed directly or successfully parsed from string)
        if ($parsedDateTime) {
            # Convert to UTC and then format to ISO 8601 string for JavaScript Date compatibility.
            # The 'Z' suffix indicates UTC time.
            $isoUtcDateString = $parsedDateTime.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
            $dateInputData | Add-Member -MemberType NoteProperty -Name "result" -Value $isoUtcDateString -Force # 'result' is used for initial value in TS def
        }

        # Create the ViewMessage for input.date
        $commandMessage = New-ViewMessage -Command $CommandType -Data $dateInputData -IsEvent $false

        # Extract the commandId for waiting
        $commandId = $commandMessage.commandId

        # Manually construct JSON payload and send it via Write-Host -NoNewline
        $payload = ConvertTo-Json -InputObject $commandMessage -Compress -Depth 10

        Write-Host "[>-command-<] $payload" -NoNewline

        # Wait for the response from the extension via stdin
        # The response will contain 'result' (the selected date as UTC ISO string)
        # and 'resultButton' (label of clicked button)
        $response = Wait-ForResponse -CommandId $commandId -ExpectedCommand $CommandType

        # Post-process the response: if 'result' is a DateTime object, convert it to local time
        if ($response -and $response.result -is [datetime]) {
            try {
                # The extension sends UTC, so the DateTime object received here should be Kind: Utc.
                # Convert it to the local system time.
                if ($response.result.Kind -eq [System.DateTimeKind]::Utc) {
                    $response.result = $response.result.ToLocalTime()
                }
            }
            catch {
                Write-Warning "Failed to convert DateTime to local time: $($_.Exception.Message)"
            }
        } elseif ($response -and $response.result -is [string] -and -not [string]::IsNullOrEmpty($response.result)) {
            # This block handles cases where it might still be a string (e.g., if ConvertFrom-Json fails for some reason or format changes).
            # This is less likely now given PowerShell's auto-conversion.
            try {
                $response.result = [datetime]::Parse($response.result, $null, [System.Globalization.DateTimeStyles]::RoundtripKind).ToLocalTime()
            } catch {
                Write-Warning "Failed manual parse of date string '$($response.result)': $($_.Exception.Message)"
            }
        }

        return $response # This will be the object containing result (DateTime or string) and resultButton
    }.GetNewClosure()

    [void](Add-Member -InputObject $script:Ui -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock)
    return $null
}

# --- New: Add _Add-UiInlineConfirmMethod for inline.confirm ---
function _Add-UiInlineConfirmMethod {
    param (
        [Parameter(Mandatory=$true)]
        [string]$MethodName,
        [Parameter(Mandatory=$true)]
        [string]$CommandType
    )
    $scriptBlock = {
        param (
            [Parameter(Mandatory=$true)]
            [string]$Message, # Corresponds to InlineConfirmData.message
            [string[]]$Buttons = $null # Corresponds to InlineConfirmData.buttons
        )

        # 1. Prepare the data for the command
        $inlineConfirmData = [PSCustomObject]@{
            message = $Message
        }

        if ($Buttons -and $Buttons.Count -gt 0) {
            $inlineConfirmData | Add-Member -MemberType NoteProperty -Name "buttons" -Value $Buttons -Force
        }

        # 2. Create the ViewMessage for inline.confirm
        $commandMessage = New-ViewMessage -Command $CommandType -Data $inlineConfirmData -IsEvent $false

        # Extract the commandId for waiting
        $commandId = $commandMessage.commandId

        # 3. Manually construct JSON payload and send it via Write-Host -NoNewline
        $payload = ConvertTo-Json -InputObject $commandMessage -Compress -Depth 10

        Write-Host "[>-command-<] $payload" -NoNewline # Send the command to the extension

        # 4. Wait for the response from the extension via stdin
        $response = Wait-ForResponse -CommandId $commandId -ExpectedCommand $CommandType

        return $response # This will be the 'result' property (e.g., button label)
    }.GetNewClosure()

    [void](Add-Member -InputObject $script:Ui -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock)
    return $null
}

# --- New: Add _Add-UiInlineSelectMethod for inline.select ---
function _Add-UiInlineSelectMethod {
    param (
        [Parameter(Mandatory=$true)]
        [string]$MethodName,
        [Parameter(Mandatory=$true)]
        [string]$CommandType
    )
    $scriptBlock = {
        param (
            [Parameter(Mandatory=$true)]
            [string]$Label, # Corresponds to SelectData.label

            [Parameter(Mandatory=$true)]
            [array]$Options, # Corresponds to SelectData.options (list of objects)

            [Parameter(Mandatory=$false)]
            [string]$LabelKey = $null, # Corresponds to SelectData.labelKey

            [Parameter(Mandatory=$false)]
            [string[]]$Buttons = $null # Corresponds to SelectData.buttons
        )

        # Prepare the data for the command
        $selectData = [PSCustomObject]@{
            label = $Label
            options = $Options # Pass the raw PowerShell array here. ConvertTo-Json will handle it.
        }

        if (-not [string]::IsNullOrEmpty($LabelKey)) {
            $selectData | Add-Member -MemberType NoteProperty -Name "labelKey" -Value $LabelKey -Force
        }
        if ($Buttons -and $Buttons.Count -gt 0) {
            $selectData | Add-Member -MemberType NoteProperty -Name "buttons" -Value $Buttons -Force
        }

        # Create the ViewMessage for inline.select
        $commandMessage = New-ViewMessage -Command $CommandType -Data $selectData -IsEvent $false

        # Extract the commandId for waiting
        $commandId = $commandMessage.commandId

        # Manually construct JSON payload and send it via Write-Host -NoNewline
        $payload = ConvertTo-Json -InputObject $commandMessage -Compress -Depth 10

        Write-Host "[>-command-<] $payload" -NoNewline

        # Wait for the response from the extension via stdin
        # The response will contain 'result' (the selected option object)
        # and 'resultButton' (label of clicked button)
        $response = Wait-ForResponse -CommandId $commandId -ExpectedCommand $CommandType

        return $response # This will be the object containing result and resultButton
    }.GetNewClosure()

    [void](Add-Member -InputObject $script:Ui -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock)
    return $null
}

# --- New: Add _Add-UiWindowShowTextMethod for window.text ---
function _Add-UiWindowShowTextMethod {
    param (
        [Parameter(Mandatory=$true)]
        [string]$MethodName,
        [Parameter(Mandatory=$true)]
        [string]$CommandType
    )
    $scriptBlock = {
        param (
            [Parameter(Mandatory=$true)]
            [string]$Text, # Corresponds to WindowTextData.text

            [Parameter(Mandatory=$false)]
            [string]$Language = $null # Corresponds to WindowTextData.language
        )

        # Prepare the data for the command
        $windowTextData = [PSCustomObject]@{
            text = $Text
        }

        if (-not [string]::IsNullOrEmpty($Language)) {
            $windowTextData | Add-Member -MemberType NoteProperty -Name "language" -Value $Language -Force
        }

        # Create the ViewMessage for window.text
        $commandMessage = New-ViewMessage -Command $CommandType -Data $windowTextData -IsEvent $false

        # Manually construct JSON payload and send it via Write-Host -NoNewline
        $payload = ConvertTo-Json -InputObject $commandMessage -Compress -Depth 10

        Write-Host "[>-command-<] $payload" -NoNewline

        # window.text typically doesn't expect a direct response, so return null.
        return $null
    }.GetNewClosure()

    [void](Add-Member -InputObject $script:Ui -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock)
    return $null
}

# --- New: Add _Add-UiFileOpenMethod for file.open ---
function _Add-UiFileOpenMethod {
    param (
        [Parameter(Mandatory=$true)]
        [string]$MethodName,
        [Parameter(Mandatory=$true)]
        [string]$CommandType
    )
    $scriptBlock = {
        param (
            [Parameter(Mandatory=$false)]
            [bool]$CanSelectMany = $false, # Corresponds to FileOpenData.canSelectMany

            [Parameter(Mandatory=$false)]
            [hashtable]$Filters = $null # Corresponds to FileOpenData.filters ({ [key: string]: string[] })
        )

        # Prepare the data for the command
        $fileOpenData = [PSCustomObject]@{} # Start with an empty object

        # Add canSelectMany if it's true (default is false, so no need to send if false)
        if ($CanSelectMany) {
            $fileOpenData | Add-Member -MemberType NoteProperty -Name "canSelectMany" -Value $true -Force
        }

        # Add filters if provided and not empty
        if ($Filters -and $Filters.Count -gt 0) {
            # PowerShell hashtables serialize well to JSON objects for this structure
            $fileOpenData | Add-Member -MemberType NoteProperty -Name "filters" -Value $Filters -Force
        }

        # Create the ViewMessage for file.open
        $commandMessage = New-ViewMessage -Command $CommandType -Data $fileOpenData -IsEvent $false

        # Extract the commandId for waiting
        $commandId = $commandMessage.commandId

        # Manually construct JSON payload and send it via Write-Host -NoNewline
        $payload = ConvertTo-Json -InputObject $commandMessage -Compress -Depth 10

        Write-Host "[>-command-<] $payload" -NoNewline

        # Wait for the response from the extension via stdin
        # The response will contain the 'data' property, which has the 'result' (array of file paths)
        $response = Wait-ForResponse -CommandId $commandId -ExpectedCommand $CommandType

        # The extension will send back the result in responseObject.data.result
        return $response
    }.GetNewClosure()

    [void](Add-Member -InputObject $script:Ui -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock)
    return $null
}

# --- New: Add _Add-UiFileOpenFolderMethod for file.openFolder ---
function _Add-UiFileOpenFolderMethod {
    param (
        [Parameter(Mandatory=$true)]
        [string]$MethodName,
        [Parameter(Mandatory=$true)]
        [string]$CommandType
    )
    $scriptBlock = {
        param (
            [Parameter(Mandatory=$false)]
            [bool]$CanSelectMany = $false # Corresponds to FileOpenFolderData.canSelectMany
        )

        # Prepare the data for the command
        $fileOpenFolderData = [PSCustomObject]@{} # Start with an empty object

        # Add canSelectMany if it's true (default is false, so no need to send if false)
        if ($CanSelectMany) {
            $fileOpenFolderData | Add-Member -MemberType NoteProperty -Name "canSelectMany" -Value $true -Force
        }

        # Create the ViewMessage for file.openFolder
        $commandMessage = New-ViewMessage -Command $CommandType -Data $fileOpenFolderData -IsEvent $false

        # Extract the commandId for waiting
        $commandId = $commandMessage.commandId

        # Manually construct JSON payload and send it via Write-Host -NoNewline
        $payload = ConvertTo-Json -InputObject $commandMessage -Compress -Depth 10

        Write-Host "[>-command-<] $payload" -NoNewline

        # Wait for the response from the extension via stdin
        # The response will contain the 'data' property, which has the 'result' (array of folder paths)
        $response = Wait-ForResponse -CommandId $commandId -ExpectedCommand $CommandType

        # The extension will send back the result in responseObject.data.result
        return $response
    }.GetNewClosure()

    [void](Add-Member -InputObject $script:Ui -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock)
    return $null
}

# --- New: Add _Add-UiFileSaveMethod for file.save ---
function _Add-UiFileSaveMethod {
    param (
        [Parameter(Mandatory=$true)]
        [string]$MethodName,
        [Parameter(Mandatory=$true)]
        [string]$CommandType
    )
    $scriptBlock = {
        param (
            [Parameter(Mandatory=$false)]
            [hashtable]$Filters = $null # Corresponds to FileSaveData.filters ({ [key: string]: string[] })
        )

        # Prepare the data for the command
        $fileSaveData = [PSCustomObject]@{} # Start with an empty object

        # Add filters if provided and not empty
        if ($Filters -and $Filters.Count -gt 0) {
            # PowerShell hashtables serialize well to JSON objects for this structure
            $fileSaveData | Add-Member -MemberType NoteProperty -Name "filters" -Value $Filters -Force
        }

        # Create the ViewMessage for file.save
        $commandMessage = New-ViewMessage -Command $CommandType -Data $fileSaveData -IsEvent $false

        # Extract the commandId for waiting
        $commandId = $commandMessage.commandId

        # Manually construct JSON payload and send it via Write-Host -NoNewline
        $payload = ConvertTo-Json -InputObject $commandMessage -Compress -Depth 10

        Write-Host "[>-command-<] $payload" -NoNewline

        # Wait for the response from the extension via stdin
        # The response will contain the 'data' property, which has the 'result' (single file path string)
        $response = Wait-ForResponse -CommandId $commandId -ExpectedCommand $CommandType

        # The extension will send back the result in responseObject.data.result
        return $response
    }.GetNewClosure()

    [void](Add-Member -InputObject $script:Ui -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock)
    return $null
}

# --- New: Add _Add-UiFileShowOpenMethod for file.showOpen ---
function _Add-UiFileShowOpenMethod {
    param (
        [Parameter(Mandatory=$true)]
        [string]$MethodName,
        [Parameter(Mandatory=$true)]
        [string]$CommandType
    )
    $scriptBlock = {
        param (
            [Parameter(Mandatory=$true)]
            [string]$Label, # Corresponds to FileShowOpenData.label

            [Parameter(Mandatory=$false)]
            [bool]$CanSelectMany = $false, # Corresponds to FileShowOpenData.canSelectMany

            [Parameter(Mandatory=$false)]
            [hashtable]$Filters = $null, # Corresponds to FileShowOpenData.filters

            [Parameter(Mandatory=$false)]
            [string[]]$Buttons = $null # Corresponds to FileShowOpenData.buttons
        )

        # Prepare the data for the command
        $fileShowOpenData = [PSCustomObject]@{
            label = $Label
        }

        # Add canSelectMany if it's true (default is false, so no need to send if false)
        if ($CanSelectMany) {
            $fileShowOpenData | Add-Member -MemberType NoteProperty -Name "canSelectMany" -Value $true -Force
        }

        # Add filters if provided and not empty
        if ($Filters -and $Filters.Count -gt 0) {
            $fileShowOpenData | Add-Member -MemberType NoteProperty -Name "filters" -Value $Filters -Force
        }

        # Add buttons if provided and not empty
        if ($Buttons -and $Buttons.Count -gt 0) {
            $fileShowOpenData | Add-Member -MemberType NoteProperty -Name "buttons" -Value $Buttons -Force
        }

        # Create the ViewMessage for file.showOpen
        $commandMessage = New-ViewMessage -Command $CommandType -Data $fileShowOpenData -IsEvent $false

        # Extract the commandId for waiting
        $commandId = $commandMessage.commandId

        # Manually construct JSON payload and send it via Write-Host -NoNewline
        $payload = ConvertTo-Json -InputObject $commandMessage -Compress -Depth 10

        Write-Host "[>-command-<] $payload" -NoNewline

        # Wait for the response from the extension via stdin
        # The response will contain 'result' (array of selected file paths)
        # and 'resultButton' (label of clicked button)
        $response = Wait-ForResponse -CommandId $commandId -ExpectedCommand $CommandType

        return $response # This will be the object containing result and resultButton
    }.GetNewClosure()

    [void](Add-Member -InputObject $script:Ui -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock)
    return $null
}

# --- New: Add _Add-UiFileShowOpenFolderMethod for file.showOpenFolder ---
function _Add-UiFileShowOpenFolderMethod {
    param (
        [Parameter(Mandatory=$true)]
        [string]$MethodName,
        [Parameter(Mandatory=$true)]
        [string]$CommandType
    )
    $scriptBlock = {
        param (
            [Parameter(Mandatory=$true)]
            [string]$Label, # Corresponds to FileShowOpenFolderData.label

            [Parameter(Mandatory=$false)]
            [bool]$CanSelectMany = $false, # Corresponds to FileShowOpenFolderData.canSelectMany

            [Parameter(Mandatory=$false)]
            [string[]]$Buttons = $null # Corresponds to FileShowOpenFolderData.buttons
        )

        # Prepare the data for the command
        $fileShowOpenFolderData = [PSCustomObject]@{
            label = $Label
        }

        # Add canSelectMany if it's true (default is false, so no need to send if false)
        if ($CanSelectMany) {
            $fileShowOpenFolderData | Add-Member -MemberType NoteProperty -Name "canSelectMany" -Value $true -Force
        }

        # Add buttons if provided and not empty
        if ($Buttons -and $Buttons.Count -gt 0) {
            $fileShowOpenFolderData | Add-Member -MemberType NoteProperty -Name "buttons" -Value $Buttons -Force
        }

        # Create the ViewMessage for file.showOpenFolder
        $commandMessage = New-ViewMessage -Command $CommandType -Data $fileShowOpenFolderData -IsEvent $false

        # Extract the commandId for waiting
        $commandId = $commandMessage.commandId

        # Manually construct JSON payload and send it via Write-Host -NoNewline
        $payload = ConvertTo-Json -InputObject $commandMessage -Compress -Depth 10

        Write-Host "[>-command-<] $payload" -NoNewline

        # Wait for the response from the extension via stdin
        # The response will contain 'result' (array of selected folder paths)
        # and 'resultButton' (label of clicked button)
        $response = Wait-ForResponse -CommandId $commandId -ExpectedCommand $CommandType

        return $response # This will be the object containing result and resultButton
    }.GetNewClosure()

    [void](Add-Member -InputObject $script:Ui -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock)
    return $null
}

# --- New: Add _Add-UiFileShowSaveMethod for file.showSave ---
function _Add-UiFileShowSaveMethod {
    param (
        [Parameter(Mandatory=$true)]
        [string]$MethodName,
        [Parameter(Mandatory=$true)]
        [string]$CommandType
    )
    $scriptBlock = {
        param (
            [Parameter(Mandatory=$true)]
            [string]$Label, # Corresponds to FileShowSaveData.label

            [Parameter(Mandatory=$false)]
            [hashtable]$Filters = $null, # Corresponds to FileShowSaveData.filters

            [Parameter(Mandatory=$false)]
            [string[]]$Buttons = $null # Corresponds to FileShowSaveData.buttons
        )

        # Prepare the data for the command
        $fileShowSaveData = [PSCustomObject]@{
            label = $Label
        }

        # Add filters if provided and not empty
        if ($Filters -and $Filters.Count -gt 0) {
            $fileShowSaveData | Add-Member -MemberType NoteProperty -Name "filters" -Value $Filters -Force
        }

        # Add buttons if provided and not empty
        if ($Buttons -and $Buttons.Count -gt 0) {
            $fileShowSaveData | Add-Member -MemberType NoteProperty -Name "buttons" -Value $Buttons -Force
        }

        # Create the ViewMessage for file.showSave
        $commandMessage = New-ViewMessage -Command $CommandType -Data $fileShowSaveData -IsEvent $false

        # Extract the commandId for waiting
        $commandId = $commandMessage.commandId

        # Manually construct JSON payload and send it via Write-Host -NoNewline
        $payload = ConvertTo-Json -InputObject $commandMessage -Compress -Depth 10

        Write-Host "[>-command-<] $payload" -NoNewline

        # Wait for the response from the extension via stdin
        # The response will contain 'result' (single selected file path)
        # and 'resultButton' (label of clicked button)
        $response = Wait-ForResponse -CommandId $commandId -ExpectedCommand $CommandType

        return $response # This will be the object containing result and resultButton
    }.GetNewClosure()

    [void](Add-Member -InputObject $script:Ui -MemberType ScriptMethod -Name $MethodName -Value $scriptBlock)
    return $null
}

# Add all log methods to the Ui object
_Add-UiLogMethod -MethodName "Log" -CommandType "log.log"
_Add-UiLogMethod -MethodName "Text" -CommandType "log.text"
_Add-UiLogMethod -MethodName "Info" -CommandType "log.info"
_Add-UiLogMethod -MethodName "Warn" -CommandType "log.warn"
_Add-UiLogMethod -MethodName "Error" -CommandType "log.error"
_Add-UiLogMethod -MethodName "Success" -CommandType "log.success"

# Add the dialog methods to the Ui object
_Add-UiConfirmMethod -MethodName "dialog_confirm" -CommandType "input.confirm"
_Add-UiSelectRecordMethod -MethodName "dialog_select_record" -CommandType "input.selectRecord"
_Add-UiButtonsMethod -MethodName "dialog_buttons" -CommandType "input.buttons"
_Add-UiCheckboxesMethod -MethodName "dialog_checkboxes" -CommandType "input.checkboxes"
_Add-UiRadioboxesMethod -MethodName "dialog_radioboxes" -CommandType "input.radioboxes"
_Add-UiTextInputMethod -MethodName "dialog_textInput" -CommandType "input.text"
_Add-UiInputDateMethod -MethodName "dialog_dateInput" -CommandType "input.date"

# Add the new inline methods to the Ui object
_Add-UiInlineConfirmMethod -MethodName "inline_confirm" -CommandType "inline.confirm"
_Add-UiInputDateMethod -MethodName "inline_dateInput" -CommandType "inline.date"
_Add-UiTextInputMethod -MethodName "inline_textInput" -CommandType "inline.text"
_Add-UiInlineSelectMethod -MethodName "inline_select" -CommandType "inline.select"

# Add the show methods to the Ui object
_Add-UiShowGridMethod -MethodName "show_grid" -CommandType "output.grid"
_Add-UiShowTextMethod -MethodName "show_text" -CommandType "output.text"
_Add-UiShowProgressMethod -MethodName "show_progress" -CommandType "output.progress"

# Add the window methods to the Ui object
_Add-UiShowGridMethod -MethodName "window_show_grid" -CommandType "window.grid"
_Add-UiWindowShowTextMethod -MethodName "window_show_text" -CommandType "window.text"

# Add the file methods to the Ui object
_Add-UiFileOpenMethod -MethodName "file_open" -CommandType "file.open"
_Add-UiFileOpenFolderMethod -MethodName "file_openFolder" -CommandType "file.openFolder"
_Add-UiFileSaveMethod -MethodName "file_save" -CommandType "file.save"
_Add-UiFileShowOpenMethod -MethodName "file_showOpen" -CommandType "file.showOpen"
_Add-UiFileShowOpenFolderMethod -MethodName "file_showOpenFolder" -CommandType "file.showOpenFolder"
_Add-UiFileShowSaveMethod -MethodName "file_showSave" -CommandType "file.showSave"