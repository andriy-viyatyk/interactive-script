import asyncio
import json
from typing import Any, Awaitable, Callable, Dict, Optional
from .command import ViewMessage, command_line
from .commands.log import LogCommand
from .commands.input_confirm import ConfirmCommand
from .commands.input_buttons import ButtonsCommand
from .commands.input_checkboxes import CheckboxesCommand
from .commands.input_date import DateInputCommand
from .commands.input_radioboxes import RadioboxesCommand
from .commands.output_grid import GridCommand
from .commands.output_progress import ProgressCommand
from .commands.output_text import TextCommand
from .commands.input_text import TextInputCommand
from .commands.window_show_grid import WindowGridCommand
from .commands.window_show_text import WindowTextCommand

MESSAGE_TYPE_MAPPING: Dict[str, type[ViewMessage]] = {
    "log.text": LogCommand,
    "log.log": LogCommand,
    "log.info": LogCommand,
    "log.warn": LogCommand,
    "log.error": LogCommand,
    "log.success": LogCommand,
    "input.confirm": ConfirmCommand,
    "input.buttons": ButtonsCommand,
    "input.checkboxes": CheckboxesCommand,
    "input.date": DateInputCommand,
    "input.radioboxes": RadioboxesCommand,
    "input.text": TextInputCommand,
    "output.grid": GridCommand,
    "output.progress": ProgressCommand,
    "output.text": TextCommand,
    "window.grid": WindowGridCommand,
    "window.text": WindowTextCommand,
}

def message_to_string(message: ViewMessage) -> str:
    message_json = message.to_json()
    return f"{command_line} {message_json}"

def message_from_string(line: str) -> Optional[ViewMessage]:
    if line.startswith(command_line):
        raw = line[len(command_line):].strip()
        try:
            try:
                data = json.loads(raw)
                # ... rest of your logic
            except json.JSONDecodeError as e:
                return None
            command = data.get("command")
            if command and command in MESSAGE_TYPE_MAPPING:
                message_type = MESSAGE_TYPE_MAPPING[command]
                message = message_type()
                message.init(data)
                return message
            else:
                return None
        except json.JSONDecodeError:
            return None

def watch(promise: Awaitable[Any], callback: Callable[[], Any]):
    async def _watch():
        try:
            await promise
        finally:
            callback()

    asyncio.create_task(_watch())