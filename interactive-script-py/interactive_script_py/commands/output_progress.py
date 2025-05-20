from dataclasses import dataclass, field
from typing import Any, Mapping, Optional, TypedDict, Union
from ..command import UiText, ViewMessage

class ProgressDataParam(TypedDict, total=False):
    max: Optional[float]
    value: Optional[float]
    label: Optional[UiText]
    completed: Optional[bool]

@dataclass
class ProgressData:
    max: Optional[float] = None
    value: Optional[float] = None
    label: Optional[UiText] = None
    completed: Optional[bool] = None

    def init(self, data: Mapping[str, Any]):
        self.max = data.get("max", self.max)
        self.value = data.get("value", self.value)
        self.label = data.get("label", self.label)
        self.completed = data.get("completed", self.completed)

@dataclass
class ProgressCommand(ViewMessage):
    data: ProgressData = field(default_factory=ProgressData)
    
    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))
        
def progress(params: Union[UiText, ProgressDataParam]) -> ProgressCommand:
    progress_data = ProgressData()
    if isinstance(params, (str, list)):  # Check if it's a list of data
        progress_data.init({"label": params})
    elif isinstance(params, dict):
        progress_data.init(params)

    command = ProgressCommand(
        command="output.progress",
        data=progress_data,
    )
    return command