from dataclasses import dataclass, field
from typing import Any, Mapping, Optional, TypedDict
from ..command import ViewMessage

class FileSaveDataParam(TypedDict, total=False):
    label: Optional[str]
    filters: Optional[dict[str, list[str]]]
    result: Optional[str]

@dataclass
class FileSaveData:
    label: Optional[str] = None
    filters: Optional[dict[str, list[str]]] = None
    result: Optional[str] = None
    
    def init(self, data: Mapping[str, Any]):
        self.label = data.get("label", self.label)
        self.filters = data.get("filters", self.filters)
        self.result = data.get("result", self.result)
        
@dataclass
class FileSaveCommand(ViewMessage):
    data: FileSaveData = field(default_factory=FileSaveData)

    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))
        
def file_save(params: Optional[FileSaveDataParam]) -> FileSaveCommand:
    file_save_data = FileSaveData()
    if params:
        file_save_data.init(params)

    message = FileSaveCommand(
        command="file.save",
        data=file_save_data
    )
    
    return message
