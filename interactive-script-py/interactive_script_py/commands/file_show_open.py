from dataclasses import dataclass, field
from typing import Any, Mapping, Optional, TypedDict, Union
from ..command import UiText, ViewMessage

class FileShowOpenDataParam(TypedDict, total=False):
    label: Optional[str]
    filters: Optional[dict[str, list[str]]]
    canSelectMany: Optional[bool]
    buttons: Optional[Union[list[str], list[UiText]]]
    result: Optional[list[str]]
    resultButton: Optional[str]

@dataclass
class FileShowOpenData:
    label: Optional[str] = None
    filters: Optional[dict[str, list[str]]] = None
    canSelectMany: Optional[bool] = None
    buttons: Optional[list[UiText]] = None
    result: Optional[list[str]] = None
    resultButton: Optional[str] = None
    
    def init(self, data: Mapping[str, Any]):
        self.label = data.get("label", self.label)
        self.filters = data.get("filters", self.filters)
        self.canSelectMany = data.get("canSelectMany", self.canSelectMany)
        self.buttons = data.get("buttons", self.buttons)
        self.result = data.get("result", self.result)
        self.resultButton = data.get("resultButton", self.resultButton)
    
@dataclass
class FileShowOpenCommand(ViewMessage):
    data: FileShowOpenData = field(default_factory=FileShowOpenData)
    
    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))
        
def file_show_open(params: Optional[Mapping[str, Any]]) -> FileShowOpenCommand:
    file_show_open_data = FileShowOpenData()
    if params:
        file_show_open_data.init(params)

    message = FileShowOpenCommand(
        command="file.showOpen",
        data=file_show_open_data
    )
    
    return message
    
    