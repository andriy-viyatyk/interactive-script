import ui from "interactive-script-js";

async function annoyingProcess() {
    const int = setInterval(() => {
        console.log("I am console log from annoying process");
        console.error("I am console error from annoying process");
    }, 500);

    return new Promise((resolve) => {
        setTimeout(() => {
            clearInterval(int);
            resolve(undefined);
        }, 6000);
    });
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function handleConsoleDemo() {
    const doHandle = await ui.dialog.confirm(
        "Do you want to handle console logs?"
    );
    if (doHandle === "Yes") {
        ui.output.clear();
        ui.on.consoleLog((message) => {
            ui.output.append(message);
        });
        ui.on.consoleError((message) => {
            ui.output.append(message);
        });
    }
    const proc = annoyingProcess();
    await wait(1000);
    ui.text("I am a ui.text message").color("lightseagreen").print();
    await wait(1000);
    ui.text(
        "If you selected 'Yes' to handle console logs, you can find console logs on 'OUTPUT' panel under 'Script UI' channel"
    )
        .color("lightseagreen")
        .print();
    await proc;
}

handleConsoleDemo()
    .catch(e => console.error(e))
    .finally(() => process.exit(0));
