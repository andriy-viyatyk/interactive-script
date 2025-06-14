from dataclasses import dataclass, field
from typing import Any, Mapping, Optional, TypedDict, Union
from ..command import UiText, ViewMessage

class FileShowSaveDataParam(TypedDict, total=False):
    label: Optional[str]
    filters: Optional[dict[str, list[str]]]
    buttons: Optional[Union[list[str], list[UiText]]]
    result: Optional[str]
    resultButton: Optional[str]

@dataclass
class FileShowSaveData:
    label: Optional[str] = None
    filters: Optional[dict[str, list[str]]] = None
    buttons: Optional[list[UiText]] = None
    result: Optional[str] = None
    resultButton: Optional[str] = None
    
    def init(self, data: Mapping[str, Any]):
        self.label = data.get("label", self.label)
        self.filters = data.get("filters", self.filters)
        self.buttons = data.get("buttons", self.buttons)
        self.result = data.get("result", self.result)
        self.resultButton = data.get("resultButton", self.resultButton)
        
@dataclass
class FileShowSaveCommand(ViewMessage):
    data: FileShowSaveData = field(default_factory=FileShowSaveData)

    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))
        
def file_show_save(params: Optional[Mapping[str, Any]]) -> FileShowSaveCommand:
    file_show_save_data = FileShowSaveData()
    if params:
        file_show_save_data.init(params)

    message = FileShowSaveCommand(
        command="file.showSave",
        data=file_show_save_data
    )
    
    return message