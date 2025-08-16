from dataclasses import dataclass, field
from typing import Optional, Mapping, Any, List, TypedDict
from ..command import UiText, ViewMessage
from .output_grid import GridColumn

class GridInputColumnParam(TypedDict, total=False):
    key: str
    title: Optional[UiText]
    width: Optional[int]
    dataType: Optional[str] # "string" | "number" | "boolean"
    options: Optional[List[str]]
    readonly: Optional[bool]
    hidden: Optional[bool]

class GridInputDataParam(TypedDict, total=False):
    title: Optional[UiText]
    columns: Optional[List[GridInputColumnParam]]
    editOnly: Optional[bool]
    buttons: Optional[List[UiText]]
    result: Optional[List[Any]]
    resultButton: Optional[str]

@dataclass
class GridInputData:
    title: Optional[UiText] = None
    columns: Optional[List[GridColumn]] = None
    editOnly: Optional[bool] = None
    buttons: Optional[List[UiText]] = None
    result: Optional[List[Any]] = None
    resultButton: Optional[str] = None
    
    def init(self, data: Mapping[str, Any]):
        self.title = data.get("title", None)
        data_columns = data.get("columns", None)
        if data_columns:
            self.columns = []
            for column_data in data_columns:
                column = GridColumn()
                column.init(column_data)
                self.columns.append(column)
        self.editOnly = data.get("editOnly", self.editOnly)
        self.buttons = data.get("buttons", self.buttons)
        self.result = data.get("result", self.result)
        self.resultButton = data.get("resultButton", self.resultButton)

@dataclass
class GridInputCommand(ViewMessage):
    data: GridInputData = field(default_factory=GridInputData)

    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))
        
def gridInput(params: GridInputDataParam) -> GridInputCommand:
    data = GridInputData()
    data.init(params)
    command = GridInputCommand(
        command="input.grid",
        data=data
    )
    return command