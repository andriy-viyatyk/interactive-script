from dataclasses import dataclass, field
from typing import Any, Mapping, Optional, TypedDict, Union
from ..command import UiText, ViewMessage

class FileShowOpenFolderDataParam(TypedDict, total=False):
    label: Optional[str]
    canSelectMany: Optional[bool]
    buttons: Optional[Union[list[str], list[UiText]]]
    result: Optional[list[str]]
    resultButton: Optional[str]

@dataclass
class FileShowOpenFolderData:
    label: Optional[str] = None
    canSelectMany: Optional[bool] = None
    buttons: Optional[list[UiText]] = None
    result: Optional[list[str]] = None
    resultButton: Optional[str] = None
    
    def init(self, data: Mapping[str, Any]):
        self.label = data.get("label", self.label)
        self.canSelectMany = data.get("canSelectMany", self.canSelectMany)
        self.buttons = data.get("buttons", self.buttons)
        self.result = data.get("result", self.result)
        self.resultButton = data.get("resultButton", self.resultButton)
        
@dataclass
class FileShowOpenFolderCommand(ViewMessage):
    data: FileShowOpenFolderData = field(default_factory=FileShowOpenFolderData)

    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))
        
def file_show_open_folder(params: Optional[Mapping[str, Any]]) -> FileShowOpenFolderCommand:
    file_show_open_folder_data = FileShowOpenFolderData()
    if params:
        file_show_open_folder_data.init(params)

    message = FileShowOpenFolderCommand(
        command="file.showOpenFolder",
        data=file_show_open_folder_data
    )
    
    return message