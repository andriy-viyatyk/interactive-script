from typing import List, Union, cast
from .command import UiText
from .commands.log import log
from .commands.input_confirm import confirm, ConfirmDataParam
from .commands.input_buttons import buttons, ButtonsDataParam
from .commands.input_checkboxes import checkboxes, CheckboxesDataParam, CheckboxesData
from .response_handler import send, response_handler
from .objects.styled_text import StyledLogCommand

class Dialog:
    async def confirm(self, text: Union[UiText, ConfirmDataParam]) -> str:
        response = await response_handler.send(confirm(text))
        return response.data.result if response.data.result else ""
    
    async def buttons(self, params: Union[List[str], List[UiText], ButtonsDataParam]) -> str:
        response = await response_handler.send(buttons(params))
        return response.data.result if response.data.result else ""
    
    async def checkboxes(self, params: Union[List[str], List[UiText], CheckboxesDataParam]) -> CheckboxesData:
        response = await response_handler.send(checkboxes(params))
        return response.data

class UiNamespace:
    dialog = Dialog()
    def text(self, text: UiText) -> StyledLogCommand:
        return StyledLogCommand(send(log.text(text)))
    def log(self, text: UiText) -> StyledLogCommand:
        return StyledLogCommand(send(log.log(text)))
    def info(self, text: UiText) -> StyledLogCommand:
        return StyledLogCommand(send(log.info(text)))
    def warn(self, text: UiText) -> StyledLogCommand:
        return StyledLogCommand(send(log.warn(text)))
    def error(self, text: UiText) -> StyledLogCommand:
        return StyledLogCommand(send(log.error(text)))
    def success(self, text: UiText) -> StyledLogCommand:
        return StyledLogCommand(send(log.success(text)))

ui = UiNamespace()