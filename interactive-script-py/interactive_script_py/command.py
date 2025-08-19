from dataclasses import asdict, dataclass, field
from datetime import date, datetime
import json
from typing import Any, Dict, List, Literal, Mapping, Optional, TypeVar, TypedDict, Union
from uuid import uuid4

# ──────── COMMAND TYPES ────────

command_line = "[>-command-<]"

Command = Literal[
    "unknown",
    "view.ready",
    "script.start",
    "script.stop",
    "ping",
    "clear",
    "output",
    "output.clear",
    "log.text",
    "log.log",
    "log.info",
    "log.success",
    "log.warn",
    "log.error",
    "input.confirm",
    "input.text",
    "input.buttons",
    "input.checkboxes",
    "input.radioboxes",
    "input.selectRecord",
    "input.date",
    "input.grid",
    "inline.select",
    "inline.confirm",
    "inline.text",
    "inline.date",
    "output.grid",
    "output.text",
    "output.progress",
    "window.grid",
    "window.text",
    "on.console.log",
    "on.console.error",
    "file.open",
    "file.save",
    "file.openFolder",
    "file.showOpen",
    "file.showSave",
    "file.showOpenFolder",
    "file.exists"
]

# ──────── SHARED DATA TYPES ────────

# Equivalent of: { [key: string]: string | number }
Styles = Dict[str, Union[str, int, float]]

# Equivalent of: { text: string; styles?: Styles }
class TextWithStyle(TypedDict, total=False):
    text: str
    styles: Styles

# Equivalent of: string | TextWithStyle
UiTextBlock = Union[str, TextWithStyle]

# Equivalent of: string | UiTextBlock[]
UiText = Union[str, List[UiTextBlock]]

# ──────── GENERIC VIEW MESSAGE ────────

DataT = TypeVar("DataT")

@dataclass
class ViewMessage:
    command: Command = "unknown"
    commandId: str = field(default_factory=lambda: str(uuid4()))
    isEvent: Optional[bool] = False
    
    def to_json(self) -> str:
        return json.dumps(asdict(self), default=self._serialize_json)
    
    @staticmethod
    def _serialize_json(obj):
        if isinstance(obj, date):
            return obj.isoformat()
        if isinstance(obj, datetime):
            return obj.isoformat()
        try:
            return obj.__dict__  # Try to serialize objects with a __dict__
        except AttributeError:
            raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")
    
    def init(self, data: Mapping[str, Any]):
        self.command = data.get("command", "")
        self.commandId = data.get("commandId", "")
        self.isEvent = data.get("isEvent", False)
