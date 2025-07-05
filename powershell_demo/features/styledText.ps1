. "$PSScriptRoot\..\interactive-script-ps.ps1"

$ui.text("Styled Text Demo").color("lightseagreen").fontSize(18).print();

$ui.log("You can style text using syntax: ui.text('text').color('pink').fontSize(18).print()").print();
$ui.log("It works for:").print();
$ui.text("ui.text()").print();
$ui.log("ui.log()").print();
$ui.info("ui.info()").print();
$ui.success("ui.success()").print();
$ui.warn("ui.warn()").print();
$ui.error("ui.error()").print();
$ui.text("The difference only in base color").print();
$ui.log("").print();

$ui.text("You can define text ").`
    then("color").color("yellow").`
    then(", text ").`
    then("background color").background("#000055").`
    then(", change ").`
    then("font size").fontSize(18).`
    then(" or make ").`
    then("bordered text").border("silver").`
    then(", or make it ").`
    then("all together").color("yellow").background("#000055").fontSize(18).border("silver").`
    print();

$ui.text("You can ").`
    then("underline text").underline().`
    then(", make it ").`
    then("italic").italic().`
    then(", and also ").`
    then("bold").bold().`
    print();

$ui.log("").print();
$ui.text("Also you can use style() method to set other css styles like: ").`
    then("text transform").style(@{ textTransform = "uppercase" }).`
    then(", ").`
    then("letter spacing").style(@{ letterSpacing = "2px" }).`
    then(", ").`
    then("strike through").style(@{ textDecoration = "line-through" }).`
    then(", etc.").`
    print();

$ui.log("").print();