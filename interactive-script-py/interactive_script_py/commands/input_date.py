from dataclasses import dataclass, field
from datetime import date, datetime
from typing import Any, Dict, List, Optional, TypedDict, Union
from ..command import UiText, ViewMessage

class DateInputDataParam(TypedDict, total=False):
    title: Optional[UiText]
    buttons: Optional[List[UiText]]
    result: Optional[Union[str, date]]
    resultButton: Optional[str]

@dataclass
class DateInputData:
    title: Optional[UiText] = None
    buttons: Optional[List[UiText]] = None
    result: Optional[date] = None
    resultButton: Optional[str] = None
    
    def init(self, data: Dict[str, Any]):
        self.title = data.get("title", self.title)
        self.buttons = data.get("buttons", self.buttons)
        result_value = data.get("result")
        if isinstance(result_value, str):
            try:
                dt_object = datetime.fromisoformat(result_value) if result_value else None
                self.result = dt_object.date() if dt_object else None
            except ValueError:
                print(f"Warning: Could not parse '{result_value}' as an ISO date. Setting result to None.")
                self.result = None
        else:
            self.result = result_value
        self.resultButton = data.get("resultButton", self.resultButton)
    
@dataclass
class DateInputCommand(ViewMessage):
    data: DateInputData = field(default_factory=DateInputData)
    
    def init(self, data: Dict[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))
        
def date_input(params: Optional[Union[UiText, DateInputDataParam]]) -> DateInputCommand:
    confirm_data = DateInputData()
    if isinstance(params, (str, list)):  # Check if it's UiText
        confirm_data.init({"title": params})
    elif isinstance(params, dict):  # Check if it's ConfirmDataParam (which is a dict)
        confirm_data.init(dict(params))

    message = DateInputCommand(
        command="input.date",
        data=confirm_data
    )
    return message