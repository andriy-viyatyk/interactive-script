from dataclasses import dataclass, field
from typing import Any, List, Mapping, Optional, TypedDict, Union
from ..command import UiText, ViewMessage
from .output_grid import GridColumn

class SelectRecordDataParam(TypedDict, total=False):
    title: Optional[UiText]
    records: List[Any]
    multiple: Optional[bool]
    columns: Optional[List[GridColumn]]
    buttons: Optional[List[UiText]]
    result: Optional[List[Any]]
    resultButton: Optional[str]

@dataclass
class SelectRecordData:
    title: Optional[UiText] = None
    records: List[Any] = field(default_factory=list)
    multiple: Optional[bool] = None
    columns: Optional[List[GridColumn]] = None
    buttons: Optional[List[UiText]] = None
    result: Optional[List[Any]] = None
    resultButton: Optional[str] = None
    
    def init(self, data: Mapping[str, Any]):
        self.title = data.get("title", None)
        self.records = data.get("records", [])
        self.multiple = data.get("multiple", None)
        data_columns = data.get("columns", None)
        if data_columns:
            self.columns = []
            for column_data in data_columns:
                column = GridColumn()
                column.init(column_data)
                self.columns.append(column)
        self.buttons = data.get("buttons", None)
        self.result = data.get("result", None)
        self.resultButton = data.get("resultButton", None)

@dataclass
class SelectRecordCommand(ViewMessage):
    data: SelectRecordData = field(default_factory=SelectRecordData)
    
    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))

def select_record(params: Union[List[Any], SelectRecordDataParam]) -> SelectRecordCommand:
    select_record_data = SelectRecordData()
    if isinstance(params, list):  # Check if it's a list of data
        select_record_data.init({"records": params})
    elif isinstance(params, dict):  # Check if it's SelectRecordData (which is a dict)
        select_record_data.init(params)
        
    message = SelectRecordCommand(
        command="input.selectRecord",
        data=select_record_data
    )
    
    return message