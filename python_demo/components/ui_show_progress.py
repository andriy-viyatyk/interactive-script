import asyncio
from interactive_script_py import ui, styled_text, Progress

async def long_running_task(progress: Progress):
    progress.max = 100
    progress.value = 0
    progress.label = "Calculating sheep..."
    progress_numbers = [0, 5, 10.5, 15, 20, 25.8, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]

    for n in progress_numbers:
        await asyncio.sleep(0.5)
        progress.value = n
        if n > 70:
            progress.label = "Almost there..."

    progress.completed = True
    progress.label = styled_text("Done!").color("gold").value

async def progress_demo():
    ui.log("Starting progress demo...")
    progress = ui.show.progress("Progress Demo")
    await long_running_task(progress)

    ui.log("")
    ui.log("You can also use progress with a task:")
    task = asyncio.create_task(asyncio.sleep(5))
    progress = ui.show.progress("Will be completed in 5 seconds...")
    progress.complete_when_task(task, styled_text("Done.").color("palegreen").value)
    await task

    ui.log("")
    ui.log("Progress demo completed!")

if __name__ == "__main__":
    asyncio.run(progress_demo())
