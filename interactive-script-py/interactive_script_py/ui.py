from typing import Any, Callable, List, Optional, Union, cast
from .command import UiText, ViewMessage
from .commands.log import log
from .commands.clear import clear
from .commands.input_confirm import confirm, ConfirmDataParam
from .commands.input_buttons import buttons, ButtonsDataParam
from .commands.input_checkboxes import checkboxes, CheckboxesDataParam, CheckboxesData
from .commands.input_date import date_input, DateInputDataParam, DateInputData
from .commands.input_radioboxes import radioboxes, RadioboxesDataParam, RadioboxesData
from .commands.input_text import textInput, TextInputDataParam, TextInputData
from .commands.input_select_record import select_record, SelectRecordDataParam, SelectRecordData
from .commands.inline_select import select, SelectDataParam
from .commands.inline_confirm import InlineConfirmDataParam, inline_confirm
from .commands.inline_text import inlineTextInput
from .commands.output_grid import grid_from_list, GridDataParam
from .commands.output_progress import progress, ProgressDataParam
from .commands.output_text import text_block, TextDataParam
from .commands.window_show_grid import show_grid
from .commands.window_show_text import show_text, WindowTextDataParam
from .commands.console import subscribeError, subscribeLog
from .commands.output import output_append, OutputCommand
from .commands.output_clear import output_clear
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
    
    async def select_record(self, params: Union[List[Any], SelectRecordDataParam]) -> SelectRecordData:
        response = await response_handler.send(select_record(params))
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
       
class OnNamespace:
    def console_log(self, callback: Callable[[str], None]):
        def wrapper(message: ViewMessage):
            message = cast(OutputCommand, message)
            if hasattr(message, "data") and isinstance(message.data, str):
                callback(message.data)
        unsubscribe = response_handler.subscribe(subscribeLog(), wrapper)
        return unsubscribe
    
    def console_error(self, callback: Callable[[str], None]):
        def wrapper(message: ViewMessage):
            message = cast(OutputCommand, message)
            if hasattr(message, "data") and isinstance(message.data, str):
                callback(message.data)
        unsubscribe = response_handler.subscribe(subscribeError(), wrapper)
        return unsubscribe
    
class OutputNamespace:
    def append(self, text: str):
        return send(output_append(text))
    
    def clear(self):
        return send(output_clear())
    
class InlineNamespace:
    async def select(self, params: SelectDataParam):
        response = await response_handler.send(select(params))
        return response.data
    
    async def confirm(self, params: Union[UiText, InlineConfirmDataParam]) -> str:
        response = await response_handler.send(inline_confirm(params))
        return response.data.result if response.data.result else ""
    
    async def text_input(self, params: Union[UiText, TextInputDataParam]) -> TextInputData:
        response = await response_handler.send(inlineTextInput(params))
        return response.data
        

class UiNamespace:
    def clear(self):
        return send(clear())
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
    inline = InlineNamespace()
    show = ShowNamespace()
    window = WindowNamespace()
    on = OnNamespace()
    output = OutputNamespace()

ui = UiNamespace()