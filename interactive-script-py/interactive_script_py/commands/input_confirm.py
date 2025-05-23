from dataclasses import dataclass, field
from typing import Any, List, Mapping, Optional, TypedDict, Union
from ..command import UiText, ViewMessage

class ConfirmDataParam(TypedDict, total=False):
    title: Optional[UiText]
    message: UiText
    buttons: Optional[List[UiText]]
    result: Optional[str]

@dataclass
class ConfirmData:
    title: Optional[UiText] = None
    message: UiText = ""
    buttons: Optional[List[UiText]] = None
    result: Optional[str] = None

    def init(self, data: Mapping[str, Any]):
        self.title = data.get("title", self.title)
        self.message = data.get("message", self.message)
        self.buttons = data.get("buttons", self.buttons)
        self.result = data.get("result", self.result)

@dataclass
class ConfirmCommand(ViewMessage):
    data: ConfirmData = field(default_factory=ConfirmData)

    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))


def confirm(params: Union[UiText, ConfirmDataParam]) -> ConfirmCommand:
    confirm_data = ConfirmData()
    if isinstance(params, (str, list)):  # Check if it's UiText
        confirm_data.init({"message": params})
    elif isinstance(params, dict):  # Check if it's ConfirmDataParam (which is a dict)
        confirm_data.init(dict(params))

    message = ConfirmCommand(
        command="input.confirm",
        data=confirm_data
    )
    return message
