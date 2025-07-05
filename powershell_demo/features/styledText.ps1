. "$PSScriptRoot\..\interactive-script-ps.ps1"

$ui.text("Styled Text Demo").color("lightseagreen").fontSize(18).print();

$ui.log("You can style text using syntax: ui.text('text').color('pink').fontSize(18).print()").print();
$ui.log("It works for:");
$ui.text("ui.text()");
$ui.log("ui.log()");
$ui.info("ui.info()");
$ui.success("ui.success()");
$ui.warn("ui.warn()");
$ui.error("ui.error()");
$ui.text("The difference only in base color");
$ui.log("");