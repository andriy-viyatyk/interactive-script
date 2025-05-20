from dataclasses import dataclass, field
from typing import Any, List, Mapping, Optional, TypedDict, Union
from ..command import UiText, Styles, ViewMessage

class RadioboxesDataParam(TypedDict, total=False):
    items: Union[List[str], List[UiText]]
    title: Optional[UiText]
    buttons: Optional[List[UiText]]
    result: Optional[str]
    resultButton: Optional[str]
    bodyStyles: Optional[Styles]

@dataclass
class RadioboxesData:
    items: List[UiText] = field(default_factory=list)
    title: Optional[UiText] = None
    buttons: Optional[List[UiText]] = None
    result: Optional[str] = None
    resultButton: Optional[str] = None
    bodyStyles: Optional[Styles] = None
    
    def init(self, data: Mapping[str, Any]):
        self.items = data.get("items", self.items)
        self.title = data.get("title", self.title)
        self.buttons = data.get("buttons", self.buttons)
        self.result = data.get("result", self.result)
        self.resultButton = data.get("resultButton", self.resultButton)
        self.bodyStyles = data.get("bodyStyles", self.bodyStyles)

@dataclass 
class RadioboxesCommand(ViewMessage):
    data: RadioboxesData = field(default_factory=RadioboxesData)

    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))

def radioboxes(params: Union[List[str], List[UiText], RadioboxesDataParam]) -> RadioboxesCommand:
    radioboxes_data = RadioboxesData()
    if isinstance(params, list):  # Check if it's a list of UiText
        radioboxes_data.init({"items": params})
    elif isinstance(params, dict):  # Check if it's RadioboxesData (which is a dict)
        radioboxes_data.init(dict(params))

    message = RadioboxesCommand(
        command="input.radioboxes",
        data=radioboxes_data
    )
    return message