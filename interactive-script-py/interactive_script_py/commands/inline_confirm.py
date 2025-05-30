from dataclasses import dataclass, field
from typing import Any, List, Mapping, Optional, TypedDict, Union
from ..command import UiText, ViewMessage

class InlineConfirmDataParam(TypedDict, total=False):
    message: UiText
    buttons: Optional[List[UiText]]
    result: Optional[str]

@dataclass
class InlineConfirmData:
    message: UiText = ""
    buttons: Optional[List[UiText]] = None
    result: Optional[str] = None

    def init(self, data: Mapping[str, Any]):
        self.message = data.get("message", self.message)
        self.buttons = data.get("buttons", self.buttons)
        self.result = data.get("result", self.result)

@dataclass
class InlineConfirmCommand(ViewMessage):
    data: InlineConfirmData = field(default_factory=InlineConfirmData)

    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data.init(data.get("data", {}))


def inline_confirm(params: Union[UiText, InlineConfirmDataParam]) -> InlineConfirmCommand:
    confirm_data = InlineConfirmData()
    if isinstance(params, (str, list)):  # Check if it's UiText
        confirm_data.init({"message": params})
    elif isinstance(params, dict):  # Check if it's ConfirmDataParam (which is a dict)
        confirm_data.init(dict(params))

    message = InlineConfirmCommand(
        command="inline.confirm",
        data=confirm_data
    )
    return message