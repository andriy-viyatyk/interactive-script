from dataclasses import dataclass, field
from typing import Any, Mapping, Optional, TypedDict
from ..command import ViewMessage

class FileOpenFolderDataParam(TypedDict, total=False):
    label: Optional[str]
    canSelectMany: Optional[bool]
    result: Optional[list[str]]

@dataclass
class FileOpenFolderData:
    label: Optional[str] = None
    canSelectMany: Optional[bool] = None
    result: Optional[list[str]] = None

    def init(self, data: Mapping[str, Any]):
        self.label = data.get("label", self.label)
        self.canSelectMany = data.get("canSelectMany", self.canSelectMany)
        self.result = data.get("result", self.result)
        
@dataclass
class FileOpenFolderCommand(ViewMessage):
    data: FileOpenFolderData = field(default_factory=FileOpenFolderData)

    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))
        
def file_open_folder(params: Optional[FileOpenFolderDataParam]) -> FileOpenFolderCommand:
    file_open_folder_data = FileOpenFolderData()
    if params:
        file_open_folder_data.init(params)

    message = FileOpenFolderCommand(
        command="file.openFolder",
        data=file_open_folder_data
    )
    
    return message