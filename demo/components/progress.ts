import ui, { Progress } from "interactive-script-js";

async function longRunningTask(progress: Progress) {
    progress.max = 100;
    progress.value = 0;
    progress.label = "Calculating sheeps...";
    const progressNumbers = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
    for (let n of progressNumbers) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        progress.value = n;
        if (n > 70) {
            progress.label = "Almost there...";
        }
    };
    progress.completed = true;
    progress.label = "Done!";

  // Simulate a long-running task
  await new Promise((resolve) => setTimeout(resolve, 5000));
}

async function progressDemo() {
    ui.log("Starting progress demo...");
    const progress = ui.display.progress("Progress Demo");
    await longRunningTask(progress);
    ui.log("Progress demo completed!");
}

progressDemo().finally(() => {
  process.exit(0);
});