from dataclasses import dataclass, field
from typing import Any, List, Mapping, Union
from ..command import ViewMessage
from .output_grid import GridData, GridDataParam
    
@dataclass
class WindowGridCommand(ViewMessage):
    data: GridData = field(default_factory=GridData)
    
    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))

def show_grid(params: Union[List[Any], GridDataParam]) -> WindowGridCommand:
    grid_data = GridData()
    if isinstance(params, list):  # Check if it's a list of data
        grid_data.init({"data": params})
    elif isinstance(params, dict):  # Check if it's GridData (which is a dict)
        grid_data.init(params)
        
    message = WindowGridCommand(
        command="window.grid",
        data=grid_data,
    )
    
    return message