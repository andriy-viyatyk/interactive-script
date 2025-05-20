from typing import List, Optional, TypeVar, Union
from ..command import UiText, TextWithStyle, Styles
from .styled_text_color import StyledTextColor
from ..commands.log import LogCommand
from ..response_handler import send

_StyledTextT = TypeVar("_StyledTextT", bound="StyledText")  # Bound to StyledText


class StyledText:
    def __init__(self, ui_text: Optional[UiText] = None):
        self.value: UiText = ui_text or ""

    def _prepare_last_line(self) -> None:
        if self.value is None:
            self.value = []
        if isinstance(self.value, str):
            self.value = [self.value]
        if not self.value:
            self.value.append({"text": "", "styles": {}})

        last_line = self.value[-1]
        if isinstance(last_line, str):
            self.value[-1] = {"text": last_line, "styles": {}}

    @property
    def _data(self) -> List[TextWithStyle]:
        self._prepare_last_line()
        return self.value  # type: ignore

    @property
    def _last_line(self) -> TextWithStyle:
        data = self._data
        return data[-1]  # type: ignore

    # Use the TypeVar as the return type
    def then(self: _StyledTextT, text: Optional[str] = "") -> _StyledTextT:
        safe_text: str = text if text is not None else ""
        self._data.append({"text": safe_text, "styles": {}})
        return self

    def color(self: _StyledTextT, color: StyledTextColor) -> _StyledTextT:
        self._last_line["styles"]["color"] = color  # type: ignore
        return self

    def background(self: _StyledTextT, color: StyledTextColor) -> _StyledTextT:
        last_line = self._last_line
        last_line["styles"]["backgroundColor"] = color  # type: ignore
        last_line["styles"]["padding"] = "0 2px"  # type: ignore
        last_line["styles"]["borderRadius"] = 2  # type: ignore
        return self

    def border(self: _StyledTextT, color: StyledTextColor) -> _StyledTextT:
        last_line = self._last_line
        last_line["styles"]["border"] = f"1px solid {color}"  # type: ignore
        last_line["styles"]["borderRadius"] = 2  # type: ignore
        last_line["styles"]["padding"] = "0 2px"  # type: ignore
        return self

    def font_size(self: _StyledTextT, size: Union[str, int]) -> _StyledTextT:
        self._last_line["styles"]["fontSize"] = size  # type: ignore
        return self

    def underline(self: _StyledTextT) -> _StyledTextT:
        self._last_line["styles"]["textDecoration"] = "underline"  # type: ignore
        return self

    def italic(self: _StyledTextT) -> _StyledTextT:
        self._last_line["styles"]["fontStyle"] = "italic"  # type: ignore
        return self

    def bold(self: _StyledTextT) -> _StyledTextT:
        self._last_line["styles"]["fontWeight"] = "bold"  # type: ignore
        return self

    def style(self: _StyledTextT, styles: Styles) -> _StyledTextT:
        last_line = self._last_line
        last_line["styles"] = {**last_line["styles"], **styles}  # type: ignore
        return self
    
class StyledLogCommand(StyledText):
    def __init__(self, command: LogCommand):
        super().__init__(command.data)
        self.command: LogCommand = command

    def print(self) -> None:
        self.command.data = self.value
        send(self.command)  # Assuming send is in the same module.  If not import.
    
def styled_text(value: str) -> StyledText:
    return StyledText(value)