from dataclasses import dataclass, field
from typing import Any, List, Mapping, Optional, TypedDict, Union
from ..command import UiText, ViewMessage

class GridColumnParam(TypedDict, total=False):
    key: str
    title: Optional[UiText]
    width: Optional[int]
    
class GridDataParam(TypedDict, total=False):
    title: Optional[UiText]
    data: List[Any]
    columns: Optional[List[GridColumnParam]]

@dataclass
class GridColumn:
    key: str = ""
    title: Optional[str] = None
    width: Optional[int] = None
    dataType: Optional[str] = None  # "string" | "number" | "boolean"
    options: Optional[List[str]] = None
    readonly: Optional[bool] = None
    hidden: Optional[bool] = None
    
    def init(self, data: Mapping[str, Any]):
        self.key = data.get("key", self.key)
        self.title = data.get("title", self.title)
        self.width = data.get("width", self.width)
        self.dataType = data.get("dataType", self.dataType)
        self.options = data.get("options", self.options)
        self.readonly = data.get("readonly", self.readonly)
        self.hidden = data.get("hidden", self.hidden)

@dataclass
class GridData:
    title: Optional[UiText] = None
    data: List[Any] = field(default_factory=list)
    columns: Optional[List[GridColumn]] = None

    def init(self, data: Mapping[str, Any]):
        self.title = data.get("title", self.title)
        self.data = data.get("data", self.data)
        data_columns = data.get("columns", None)
        if data_columns:
            self.columns = []
            for column_data in data_columns:
                column = GridColumn()
                column.init(column_data)
                self.columns.append(column)

@dataclass
class GridCommand(ViewMessage):
    data: GridData = field(default_factory=GridData)
    
    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))
        
        
def grid_from_list(params: Union[List[Any], GridDataParam]) -> GridCommand:
    grid_data = GridData()
    if isinstance(params, list):  # Check if it's a list of data
        grid_data.init({"data": params})
    elif isinstance(params, dict):  # Check if it's GridData (which is a dict)
        grid_data.init(params)
        
    message = GridCommand(
        command="output.grid",
        data=grid_data
    )
    return message