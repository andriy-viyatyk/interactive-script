import ui, { Progress } from "interactive-script-js";

async function paralelProcess(progress: Progress, name: string) {
    progress.label = name;
    progress.max = 20;
    for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 101) + 100));
        progress.value = i + 1;
    }

    const pressedButton = await ui.dialog.confirm({
        title: name,
        message: "Press any button"
    });
    progress.label = `You pressed: ${pressedButton}`;

    for (let i = 10; i < 20; i++) {
        await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 101) + 100));
        progress.value = i + 1;
    }
    progress.completed = true;
}

async function paralelDemo() {
    ui.text("Paralel processes demo").color("lightseagreen").bold().print();
    ui.log("");

    const progress1 = ui.show.progress("Process 1");
    const progress2 = ui.show.progress("Process 2");

    const proc1Promise = paralelProcess(progress1, "Process 1");
    const proc2Promise = paralelProcess(progress2, "Process 2");
    
    await Promise.all([proc1Promise, proc2Promise]);
    
    ui.log("");
    ui.text("Both processes completed.");
}

paralelDemo()
    .catch((error) => {
        ui.error("An error occurred: " + error.message);
    })
    .finally(() => {
        ui.log("Demo completed.");
        process.exit(0);
    });