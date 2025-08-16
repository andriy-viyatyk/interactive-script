import ui from "interactive-script-js";

async function pingTest() {
    ui.text("Calling ping...");

    const pingPromise = ui.ping();
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));
    const whenAny = (await Promise.race([pingPromise, timeoutPromise])) as any;

    if (whenAny?.command === "ping") {
        ui.text("Ping response received.");
        return true;
    } else {
        ui.error("Ping response not received in 1 second.");
        return false;
    }
}

pingTest()
    .catch(e => console.error(e))
    .finally(() => process.exit(0));