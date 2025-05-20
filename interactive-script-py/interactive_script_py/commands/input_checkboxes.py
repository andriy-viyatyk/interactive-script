from dataclasses import dataclass, field
from typing import Any, List, Mapping, Optional, TypedDict, Union
from ..command import UiText, Styles, ViewMessage

class CheckboxItemParam(TypedDict, total=False):
    label: Optional[UiText]
    checked: Optional[bool]

class CheckboxesDataParam(TypedDict, total=False):
    items: Optional[List[CheckboxItemParam]]
    title: Optional[UiText]
    buttons: Optional[List[UiText]]
    bodyStyles: Optional[Styles]
    result: Optional[List[str]]
    resultButton: Optional[str]

@dataclass
class CheckboxItem:
    label: UiText = ""
    checked: Optional[bool] = None

    def init(self, data: Mapping[str, Any]):
        self.label = data.get("label", self.label)
        self.checked = data.get("checked", self.checked)

@dataclass
class CheckboxesData:
    items: List[CheckboxItem] = field(default_factory=list)
    title: Optional[UiText] = None
    buttons: Optional[List[UiText]] = None
    result: Optional[List[str]] = None
    resultButton: str = ""
    bodyStyles: Optional[Styles] = None

    def init(self, data: Mapping[str, Any]):
        data_items = data.get("items", [])
        self.items = []
        for item_data in data_items:
            item = CheckboxItem()
            item.init(item_data)
            self.items.append(item)
        self.title = data.get("title", self.title)
        self.buttons = data.get("buttons", self.buttons)
        self.bodyStyles = data.get("bodyStyles", self.bodyStyles)
        self.result = data.get("result", self.result)
        self.resultButton = data.get("resultButton", self.resultButton)

@dataclass
class CheckboxesCommand(ViewMessage):
    data: CheckboxesData = field(default_factory=CheckboxesData)

    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))
        
def checkboxes(params: Union[List[str], List[UiText], CheckboxesDataParam]) -> CheckboxesCommand:
    checkboxes_data = CheckboxesData()
    if isinstance(params, list):  # Check if it's a list of UiText
        checkboxes_data.init({"items": [{"label": item} for item in params]})
    elif isinstance(params, dict):  # Check if it's CheckboxesData (which is a dict)
        checkboxes_data.init(dict(params))
        
    message = CheckboxesCommand(
        command="input.checkboxes",
        data=checkboxes_data
    )
    return message