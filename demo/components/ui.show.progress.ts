import ui, { Progress, styledText } from "interactive-script-js";

async function longRunningTask(progress: Progress) {
    progress.max = 100;
    progress.value = 0;
    progress.label ="Calculating sheep...";
    const progressNumbers = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
    for (let n of progressNumbers) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        progress.value = n;
        if (n > 70) {
            progress.label = "Almost there...";
        }
    };
    progress.completed = true;
    progress.label = styledText("Done!").color("gold").value;
}

async function progressDemo() {
    ui.log("Starting progress demo...");
    let progress = ui.show.progress("Progress Demo");
    await longRunningTask(progress);

    ui.log("");
    ui.log("You can also use progress with a promise:");
    const promise = new Promise((resolve) => setTimeout(resolve, 5000));
    progress = ui.show.progress("Will be completed in 5 seconds...");
    progress.conpleteWhenPromise(promise, styledText("Done.").color("palegreen").value);
    await promise;

    ui.log("");
    ui.log("Progress demo completed!");
}

progressDemo().finally(() => {
  process.exit(0);
});