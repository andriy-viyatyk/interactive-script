from typing import Any, Dict, List, Optional, Union, cast
from .command import UiText
from .commands.log import log
from .commands.input_confirm import confirm, ConfirmDataParam
from .commands.input_buttons import buttons, ButtonsDataParam
from .commands.input_checkboxes import checkboxes, CheckboxesDataParam, CheckboxesData
from .commands.input_date import date_input, DateInputDataParam, DateInputData
from .commands.input_radioboxes import radioboxes, RadioboxesDataParam, RadioboxesData
from .commands.input_text import textInput, TextInputDataParam, TextInputData
from .commands.output_grid import grid_from_list, GridDataParam, GridData
from .commands.output_progress import progress, ProgressDataParam
from .commands.output_text import text_block, TextDataParam
from .commands.window_show_grid import show_grid
from .commands.window_show_text import show_text, WindowTextDataParam
from .response_handler import send, response_handler
from .objects.styled_text import StyledLogCommand
from .objects.progress import Progress

class DialogNamespace:
    async def confirm(self, text: Union[UiText, ConfirmDataParam]) -> str:
        response = await response_handler.send(confirm(text))
        return response.data.result if response.data.result else ""
    
    async def buttons(self, params: Union[List[str], List[UiText], ButtonsDataParam]) -> str:
        response = await response_handler.send(buttons(params))
        return response.data.result if response.data.result else ""
    
    async def checkboxes(self, params: Union[List[str], List[UiText], CheckboxesDataParam]) -> CheckboxesData:
        response = await response_handler.send(checkboxes(params))
        return response.data
    
    async def radioboxes(self, params: Union[List[str], List[UiText], RadioboxesDataParam]) -> RadioboxesData:
        response = await response_handler.send(radioboxes(params))
        return response.data

    async def date_input(self, params: Optional[Union[UiText, DateInputDataParam]] = None) -> DateInputData:
        response = await response_handler.send(date_input(params))
        return response.data
    
    async def text_input(self, params: Union[UiText, TextInputDataParam]) -> TextInputData:
        response = await response_handler.send(textInput(params))
        return response.data

class ShowNamespace:
    def grid_from_list(self, params: Union[List[Any], GridDataParam]):
        return send(grid_from_list(params))
    
    def progress(self, params: Union[UiText, ProgressDataParam]):
        return Progress(send(progress(params)))
    
    def text_block(self, params: Union[str, TextDataParam]):
        return send(text_block(params))
    
class WindowNamespace:
    def show_grid(self, params: Union[List[Any], GridDataParam]):
        return send(show_grid(params))
    
    def show_text(self, params: Union[str, WindowTextDataParam]):
        return send(show_text(params))
       

class UiNamespace:
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
    dialog = DialogNamespace()
    show = ShowNamespace()
    window = WindowNamespace()

ui = UiNamespace()