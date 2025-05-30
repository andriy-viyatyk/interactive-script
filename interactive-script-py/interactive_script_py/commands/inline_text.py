from dataclasses import dataclass, field
from typing import Any, Mapping, Union
from ..command import UiText, ViewMessage
from .input_text import TextInputData, TextInputDataParam


@dataclass
class InlineTextInputCommand(ViewMessage):
    data: TextInputData = field(default_factory=TextInputData)
    
    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))
        
def inlineTextInput(params: Union[UiText, TextInputDataParam]) -> InlineTextInputCommand:
    data = TextInputData()
    if isinstance(params, (str, list)):
        data.init({"title": params})
    elif isinstance(params, dict):
        data.init(params)

    command = InlineTextInputCommand(
        command="inline.text",
        data=data,
    )
    return command