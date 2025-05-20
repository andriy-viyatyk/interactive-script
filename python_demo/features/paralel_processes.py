import asyncio
import random
from interactive_script_py import ui, Progress

async def paralel_process(progress: Progress, name: str):
    progress.label = name
    progress.max = 20

    for i in range(10):
        await asyncio.sleep(random.uniform(0.1, 0.2))
        progress.value = i + 1

    pressed_button = await ui.dialog.confirm({
        "title": name,
        "message": "Press any button"
    })
    progress.label = f"You pressed: {pressed_button}"

    for i in range(10, 20):
        await asyncio.sleep(random.uniform(0.1, 0.2))
        progress.value = i + 1

    progress.completed = True

async def paralel_demo():
    ui.text("Paralel processes demo").color("lightseagreen").bold().print()
    ui.log("")

    progress1 = ui.show.progress("Process 1")
    progress2 = ui.show.progress("Process 2")

    proc1_task = asyncio.create_task(paralel_process(progress1, "Process 1"))
    proc2_task = asyncio.create_task(paralel_process(progress2, "Process 2"))

    await asyncio.gather(proc1_task, proc2_task)

    ui.log("")
    ui.text("Both processes completed.").print()

def main():
    try:
        asyncio.run(paralel_demo())
    except Exception as e:
        ui.error(f"An error occurred: {e}")
    finally:
        ui.log("Demo completed.")

if __name__ == "__main__":
    main()
