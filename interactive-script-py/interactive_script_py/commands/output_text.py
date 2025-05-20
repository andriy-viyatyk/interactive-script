from dataclasses import dataclass, field
from typing import Any, Mapping, Optional, TypedDict, Union
from ..command import UiText, ViewMessage

class TextDataParam(TypedDict, total=False):
    text: str
    title: Optional[UiText]

@dataclass
class TextData:
    text: str = ''
    title: Optional[UiText] = None
    
    def init(self, data: Mapping[str, Any]):
        self.text = data.get("text", self.text)
        self.title = data.get("title", self.title)

@dataclass
class TextCommand(ViewMessage):
    data: TextData = field(default_factory=TextData)
    
    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))

def text_block(params: Union[str, TextDataParam]) -> TextCommand:
    text_data = TextData()
    if isinstance(params, str):  # Check if it's a list of data
        text_data.init({"text": params})
    elif isinstance(params, dict):
        text_data.init(params)

    command = TextCommand(
        command="output.text",
        data=text_data,
    )
    return command