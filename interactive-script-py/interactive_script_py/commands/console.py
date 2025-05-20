from dataclasses import dataclass
from typing import Any, Mapping, Optional
from ..command import ViewMessage

@dataclass
class ConsoleCommand(ViewMessage):
    data: Optional[str] = None
    
    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data = data.get("data", None)
        
def subscribeLog() -> ConsoleCommand:
    message = ConsoleCommand(
        command="on.console.log"
    )
    return message

def subscribeError() -> ConsoleCommand:
    message = ConsoleCommand(
        command="on.console.error"
    )
    return message