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

function New-TextWithStyle {
    param (
        [string]$Text = "",
        [hashtable]$Styles = @{}
    )
    # Always return a mutable hashtable for 'styles' here.
    # The conversion for JSON serialization will happen in the Print() method.
    return @{
        text = $Text
        styles = $Styles
    }
}

function styledText {
    param (
        [string]$InitialText = "",
        [string]$CommandTypeInternal = "log.text" # Default command type if not specified by ui_log/info etc.
    )

    # Create a custom PowerShell object (PSObject) to hold our data and methods
    $styledTextObject = New-Object -TypeName PSObject

    # --- FIX: Initialize _textBlocks directly as a NoteProperty with a new ArrayList ---
    $styledTextObject | Add-Member -MemberType NoteProperty -Name "_textBlocks" -Value ([System.Collections.ArrayList]::new())
    # Now, add the initial text block directly to the property's ArrayList
    [void]$styledTextObject._textBlocks.Add((New-TextWithStyle -Text $InitialText))

    # Add other properties
    $styledTextObject | Add-Member -MemberType NoteProperty -Name "_commandType" -Value $CommandTypeInternal
    $styledTextObject | Add-Member -MemberType NoteProperty -Name "_commandId" -Value (New-Guid)

    # --- FIX: Override ToString() to prevent implicit object output ---
    $styledTextObject | Add-Member -MemberType ScriptMethod -Name "ToString" -Value { return ""; } -Force

    # --- Chaining Methods ---

    # .then() equivalent: Appends a new text block
    $thenScript = {
        param (
            [string]$Text = ""
        )
        [void]$this._textBlocks.Add((New-TextWithStyle -Text $Text))
        return $this # Return the object for chaining
    }.GetNewClosure()
    $styledTextObject | Add-Member -MemberType ScriptMethod -Name "Then" -Value $thenScript


    # Helper to get the last text block
    $getLastLineScript = {
        # This will now reliably access $this._textBlocks which is guaranteed to be an ArrayList
        return $this._textBlocks[$this._textBlocks.Count - 1]
    }.GetNewClosure()
    $styledTextObject | Add-Member -MemberType ScriptMethod -Name "_GetLastLine" -Value $getLastLineScript


    # --- Styling Methods (Apply to the last text block) ---

    $colorScript = {
        param (
            [string]$Color
        )
        $lastLine = $this._GetLastLine()
        $lastLine.styles.color = $Color
        return $this
    }.GetNewClosure()
    $styledTextObject | Add-Member -MemberType ScriptMethod -Name "Color" -Value $colorScript

    $backgroundScript = {
        param (
            [string]$Color
        )
        $lastLine = $this._GetLastLine()
        $lastLine.styles.backgroundColor = $Color
        $lastLine.styles.padding = "0 2px"
        $lastLine.styles.borderRadius = 2
        return $this
    }.GetNewClosure()
    $styledTextObject | Add-Member -MemberType ScriptMethod -Name "Background" -Value $backgroundScript

    $borderScript = {
        param (
            [string]$Color
        )
        $lastLine = $this._GetLastLine()
        $lastLine.styles.border = "1px solid $($Color)"
        $lastLine.styles.borderRadius = 2
        $lastLine.styles.padding = "0 2px"
        return $this
    }.GetNewClosure()
    $styledTextObject | Add-Member -MemberType ScriptMethod -Name "Border" -Value $borderScript

    $fontSizeScript = {
        param (
            [string]$Size
        )
        $lastLine = $this._GetLastLine()
        $lastLine.styles.fontSize = "$($Size)px"
        return $this
    }.GetNewClosure()
    $styledTextObject | Add-Member -MemberType ScriptMethod -Name "FontSize" -Value $fontSizeScript

    $underlineScript = {
        $lastLine = $this._GetLastLine()
        $lastLine.styles.textDecoration = "underline"
        return $this
    }.GetNewClosure()
    $styledTextObject | Add-Member -MemberType ScriptMethod -Name "Underline" -Value $underlineScript

    $italicScript = {
        $lastLine = $this._GetLastLine()
        $lastLine.styles.fontStyle = "italic"
        return $this
    }.GetNewClosure()
    $styledTextObject | Add-Member -MemberType ScriptMethod -Name "Italic" -Value $italicScript

    $boldScript = {
        $lastLine = $this._GetLastLine()
        $lastLine.styles.fontWeight = "bold"
        return $this
    }.GetNewClosure()
    $styledTextObject | Add-Member -MemberType ScriptMethod -Name "Bold" -Value $boldScript

    $styleScript = {
        param (
            [hashtable]$StylesToApply
        )
        $lastLine = $this._GetLastLine()
        $mergedStyles = @{}
        $lastLine.styles.GetEnumerator() | ForEach-Object { $mergedStyles[$_.Key] = $_.Value }
        $StylesToApply.GetEnumerator() | ForEach-Object { $mergedStyles[$_.Key] = $_.Value }
        $lastLine.styles = $mergedStyles
        return $this
    }.GetNewClosure()
    $styledTextObject | Add-Member -MemberType ScriptMethod -Name "Style" -Value $styleScript

    # .print() equivalent: Sends the final command, now using _commandType
    $printScript = {
        # --- Manually Construct JSON Payload ---

        # 1. Prepare 'data' array content
        $dataParts = @()
        foreach ($textBlock in $this._textBlocks) {
            # Escape quotes in the text value
            $textValue = $textBlock.text -replace '"', '\"'

            $stylesJson = ""
            $currentStyles = $textBlock.styles

            if ($currentStyles.Count -eq 0) {
                $stylesJson = "{}"
            } else {
                # Manually build styles JSON object
                $styleProperties = @()
                $currentStyles.GetEnumerator() | ForEach-Object {
                    $key = $_.Key
                    $value = $_.Value

                    if ($value -is [string]) {
                        $escapedValue = $value -replace '"', '\"'
                        $styleProperties += "`"$($key)`":`"$($escapedValue)`""
                    }
                    elseif ($value -is [int] -or $value -is [double]) {
                        $styleProperties += "`"$($key)`":$($value)"
                    }
                    else {
                        $escapedValue = "$($value)" -replace '"', '\"'
                        $styleProperties += "`"$($key)`":`"$($escapedValue)`""
                    }
                }
                $stylesJson = "{" + ($styleProperties -join ",") + "}"
            }
            $dataParts += "{" + "`"text`":`"$($textValue)`"," + "`"styles`":$($stylesJson)" + "}"
        }
        # Join individual text block JSON strings into a JSON array string
        $dataArrayJson = "[" + ($dataParts -join ",") + "]"

        # 2. Prepare top-level properties (ensure they are properly quoted JSON strings)
        $commandJson = "`"$($this._commandType)`""
        $commandIdJson = "`"$(New-Guid)`"" # Generate a new GUID for each command
        $isEventJson = "false"

        # 3. Assemble the final JSON payload string using a HERE-STRING
        $payload = @"
{
    "command":$commandJson,
    "commandId":$commandIdJson,
    "data":$dataArrayJson,
    "isEvent":$isEventJson
}
"@
        # Remove newlines and tabs to compress the JSON
        $payload = ($payload -replace "`r?`n", "") -replace "`t", ""

        # FIX: Added -NoNewline here as per your successful finding
        Write-Host "[>-command-<] $payload" -NoNewline
        # --- FIX: Explicitly return null to prevent any implicit output from this method ---
        return $null
    }.GetNewClosure()
    $styledTextObject | Add-Member -MemberType ScriptMethod -Name "Print" -Value $printScript

    return $styledTextObject # Return the created object for chaining
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
            [string]$Message
        )
        # Call styledText, which creates the object. Its ToString() override prevents implicit output.
        return styledText -InitialText $Message -CommandTypeInternal $CommandType
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