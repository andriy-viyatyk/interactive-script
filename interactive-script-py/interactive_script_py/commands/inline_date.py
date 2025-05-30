from dataclasses import dataclass, field
from typing import Any, Mapping, Optional, Union
from ..command import UiText, ViewMessage
from .input_date import DateInputData, DateInputDataParam

@dataclass
class InlineDateInputCommand(ViewMessage):
    data: DateInputData = field(default_factory=DateInputData)
    
    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))

def inline_date_input(params: Optional[Union[UiText, DateInputDataParam]]) -> InlineDateInputCommand:
    confirm_data = DateInputData()
    if isinstance(params, (str, list)):
        confirm_data.init({"title": params})
    elif isinstance(params, dict):
        confirm_data.init(dict(params))

    message = InlineDateInputCommand(
        command="inline.date",
        data=confirm_data
    )
    return message