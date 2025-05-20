from dataclasses import dataclass, field
from typing import Any, Mapping, Optional, TypedDict, Union
from ..command import ViewMessage

class WindowTextDataParam(TypedDict, total=False):
    text: str
    language: Optional[str]

@dataclass
class WindowTextData:
    text: str = ""
    language: Optional[str] = None
    
    def init(self, data: Mapping[str, Any]):
        self.text = data.get("text", self.text)
        self.language = data.get("language", self.language)
        
@dataclass
class WindowTextCommand(ViewMessage):
    data: WindowTextData = field(default_factory=WindowTextData)
    
    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))
        
def show_text(params: Union[str, WindowTextDataParam]) -> WindowTextCommand:
    text_data = WindowTextData()
    if isinstance(params, str):  # Check if it's a list of data
        text_data.init({"text": params})
    elif isinstance(params, dict):
        text_data.init(params)

    command = WindowTextCommand(
        command="window.text",
        data=text_data,
    )
    return command