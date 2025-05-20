from dataclasses import dataclass
from typing import Any, Mapping
from ..command import ViewMessage

@dataclass
class OutputCommand(ViewMessage):
    data: str = ''
    
    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data = data.get("data", self.data)

def output_append(text: str) -> OutputCommand:
    message = OutputCommand(
        command="output",
        data=text
    )
    return message