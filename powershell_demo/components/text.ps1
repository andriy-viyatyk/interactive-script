. "$PSScriptRoot\..\interactive-script-ps.ps1"

$ui.text("Text output methods:");
$ui.log("");

$ui.text("ui.text()");
$ui.log("ui.log()");
$ui.info("ui.info()");
$ui.success("ui.success()");
$ui.warn("ui.warn()");
$ui.error("ui.error()");

$ui.log("");
$ui.text("The difference of this methods are only in base color");
