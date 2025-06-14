from dataclasses import dataclass, field
from typing import Any, Mapping, Optional, TypedDict
from ..command import ViewMessage

class FileOpenDataParam(TypedDict, total=False):
    label: Optional[str]
    filters: Optional[dict[str, list[str]]]
    canSelectMany: Optional[bool]
    result: Optional[list[str]]

@dataclass
class FileOpenData:
    label: Optional[str] = None
    filters: Optional[dict[str, list[str]]] = None
    canSelectMany: Optional[bool] = None
    result: Optional[list[str]] = None
    
    def init(self, data: Mapping[str, Any]):
        self.label = data.get("label", self.label)
        self.filters = data.get("filters", self.filters)
        self.canSelectMany = data.get("canSelectMany", self.canSelectMany)
        self.result = data.get("result", self.result)
        
@dataclass
class FileOpenCommand(ViewMessage):
    data: FileOpenData = field(default_factory=FileOpenData)
    
    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))
        
def file_open(params: Optional[FileOpenDataParam]) -> FileOpenCommand:
    file_open_data = FileOpenData()
    if (params):
        file_open_data.init(params)

    message = FileOpenCommand(
        command="file.open",
        data=file_open_data
    )
    
    return message