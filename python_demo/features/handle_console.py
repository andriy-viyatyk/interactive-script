import asyncio
import sys
import threading
from interactive_script_py import ui

def annoying_process():
    def spam_console():
        for _ in range(12):  # 6 seconds total, every 0.5s
            print("I am console log from annoying process", flush=True)
            print("I am console error from annoying process", file=sys.stderr, flush=True)
            asyncio.run(asyncio.sleep(0.5))

    thread = threading.Thread(target=spam_console)
    thread.start()
    return thread

async def wait(ms: int):
    await asyncio.sleep(ms / 1000)

async def handle_console_demo():
    do_handle = await ui.dialog.confirm("Do you want to handle console logs?")
    
    if do_handle == "Yes":
        ui.output.clear()

        # Attach listeners to stdout and stderr
        def on_stdout(message):
            ui.output.append(message)

        def on_stderr(message):
            ui.output.append(message)

        ui.on.console_log(on_stdout)
        ui.on.console_error(on_stderr)

    proc_thread = annoying_process()
    await wait(1000)

    ui.text("I am a ui.text message").color("lightseagreen").print()
    await wait(1000)

    ui.text(
        "If you selected 'Yes' to handle console logs, you can find console logs on 'OUTPUT' panel under 'Script UI' channel"
    ).color("lightseagreen").print()

    proc_thread.join()

if __name__ == "__main__":
    try:
        asyncio.run(handle_console_demo())
    except Exception as e:
        print("An error occurred:", e, file=sys.stderr)
    finally:
        ui.log("Demo completed.")
        sys.exit(0)
