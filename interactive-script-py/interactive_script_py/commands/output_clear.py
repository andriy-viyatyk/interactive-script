from dataclasses import dataclass
from typing import Any, Mapping
from ..command import ViewMessage

@dataclass
class OutputClearCommand(ViewMessage):
    def init(self, data: Mapping[str, Any]):
        super().init(data)
        
def output_clear() -> OutputClearCommand:
    message = OutputClearCommand(
        command="output.clear"
    )
    return message