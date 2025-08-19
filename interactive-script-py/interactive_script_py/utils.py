import asyncio
import json
from typing import Any, Awaitable, Callable, Dict, Optional
from .command import ViewMessage, command_line
from .commands.clear import ClearCommand
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
from .commands.input_grid import GridInputCommand
from .commands.window_show_grid import WindowGridCommand
from .commands.window_show_text import WindowTextCommand
from .commands.input_select_record import SelectRecordCommand
from .commands.console import ConsoleCommand
from .commands.output import OutputCommand
from .commands.output_clear import OutputClearCommand
from .commands.inline_select import SelectCommand
from .commands.inline_confirm import InlineConfirmCommand
from .commands.inline_text import InlineTextInputCommand
from .commands.inline_date import InlineDateInputCommand
from .commands.file_open import FileOpenCommand
from .commands.file_open_folder import FileOpenFolderCommand
from .commands.file_save import FileSaveCommand
from .commands.file_show_open import FileShowOpenCommand
from .commands.file_show_open_folder import FileShowOpenFolderCommand
from .commands.file_show_save import FileShowSaveCommand

MESSAGE_TYPE_MAPPING: Dict[str, type[ViewMessage]] = {
    "clear": ClearCommand,
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
    "input.selectRecord": SelectRecordCommand,
    "input.grid": GridInputCommand,
    "inline.select": SelectCommand,
    "inline.confirm": InlineConfirmCommand,
    "inline.text": InlineTextInputCommand,
    "inline.date": InlineDateInputCommand,
    "output.grid": GridCommand,
    "output.progress": ProgressCommand,
    "output.text": TextCommand,
    "window.grid": WindowGridCommand,
    "window.text": WindowTextCommand,
    "on.console.log": ConsoleCommand,
    "on.console.error": ConsoleCommand,
    "output": OutputCommand,
    "output.clear": OutputClearCommand,
    "file.open": FileOpenCommand,
    "file.openFolder": FileOpenFolderCommand,
    "file.save": FileSaveCommand,
    "file.showOpen": FileShowOpenCommand,
    "file.showOpenFolder": FileShowOpenFolderCommand,
    "file.showSave": FileShowSaveCommand,
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