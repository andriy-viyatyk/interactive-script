from dataclasses import dataclass, field
from typing import Any, List, Mapping, Optional, TypedDict
from ..command import UiText, ViewMessage

class SelectDataParam(TypedDict, total=False):
    label: UiText
    options: List[Any]
    labelKey: Optional[str]
    buttons: Optional[List[UiText]]
    result: Optional[Any]
    resultButton: Optional[str]

@dataclass
class SelectData:
    label: UiText = ''
    options: List[Any] = field(default_factory=list)
    labelKey: Optional[str] = None
    buttons: Optional[List[UiText]] = None
    result: Optional[Any] = None
    resultButton: Optional[str] = None
    
    def init(self, data: Mapping[str, Any]):
        self.label = data.get("label", self.label)
        self.options = data.get("options", self.options)
        self.labelKey = data.get("labelKey", self.labelKey)
        self.buttons = data.get("buttons", self.buttons)
        self.result = data.get("result", self.result)
        self.resultButton = data.get("resultButton", self.resultButton)
    
@dataclass
class SelectCommand(ViewMessage):
    data: SelectData = field(default_factory=SelectData)
    
    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))
        
def select(params: SelectDataParam) -> SelectCommand:
    select_data = SelectData()
    select_data.init(params)
    
    message = SelectCommand(
        command="inline.select",
        data=select_data
    )
    
    return message