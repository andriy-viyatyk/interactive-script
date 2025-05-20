from dataclasses import dataclass
from typing import Any, Mapping
from ..command import ViewMessage

@dataclass
class ClearCommand(ViewMessage):
    def init(self, data: Mapping[str, Any]):
        super().init(data)

def clear() -> ClearCommand:
    message = ClearCommand(
        command="clear"
    )
    return message