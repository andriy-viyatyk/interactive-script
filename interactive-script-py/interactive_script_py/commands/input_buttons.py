from dataclasses import dataclass, field
from typing import Any, List, Mapping, Optional, TypedDict, Union
from ..command import UiText, Styles, ViewMessage

class ButtonsDataParam(TypedDict, total=False):
    buttons: Optional[Union[List[str], List[UiText]]]
    bodyStyles: Optional[Styles]
    result: Optional[str]

@dataclass
class ButtonsData:
    buttons: List[UiText] = field(default_factory=list)
    bodyStyles: Optional[Styles] = None
    result: Optional[str] = None

    def init(self, data: Mapping[str, Any]):
        self.buttons = data.get("buttons", self.buttons)
        self.bodyStyles = data.get("bodyStyles", self.bodyStyles)
        self.result = data.get("result", self.result)

@dataclass
class ButtonsCommand(ViewMessage):
    data: ButtonsData = field(default_factory=ButtonsData)
    
    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))
        
def buttons(params: Union[List[str], List[UiText], ButtonsDataParam]) -> ButtonsCommand:
    buttons_data = ButtonsData()
    if isinstance(params, list):  # Check if it's a list of UiText
        buttons_data.init({"buttons": params})
    elif isinstance(params, dict):  # Check if it's ButtonsDataParam (which is a dict)
        buttons_data.init(dict(params))

    message = ButtonsCommand(
        command="input.buttons",
        data=buttons_data
    )
    return message