from dataclasses import dataclass, field
from typing import Any, List, Mapping, Optional, TypedDict, Union
from ..command import UiText, ViewMessage

class TextInputDataParam(TypedDict, total=False):
    title: UiText
    buttons: Optional[List[UiText]]
    result: Optional[str]
    resultButton: Optional[str]

@dataclass
class TextInputData:
    title: UiText = ''
    buttons: Optional[List[UiText]] = None
    result: Optional[str] = None
    resultButton: Optional[str] = None
    
    def init(self, data: Mapping[str, Any]):
        self.title = data.get("title", self.title)
        self.buttons = data.get("buttons", self.buttons)
        self.result = data.get("result", self.result)
        self.resultButton = data.get("resultButton", self.resultButton)
    
@dataclass
class TextInputCommand(ViewMessage):
    data: TextInputData = field(default_factory=TextInputData)
    
    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))


def textInput(params: Union[UiText, TextInputDataParam]) -> TextInputCommand:
    data = TextInputData()
    if isinstance(params, (str, list)):
        data.init({"title": params})
    elif isinstance(params, dict):
        data.init(params)

    command = TextInputCommand(
        command="input.text",
        data=data,
    )
    return command