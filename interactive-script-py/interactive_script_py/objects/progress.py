from typing import Any, Awaitable, Optional
from ..commands.output_progress import ProgressCommand
from ..command import UiText
from ..response_handler import send
from ..utils import watch

class Progress:
    def __init__(self, progress: ProgressCommand):
        self._progress = progress

    def _send_update(self):
        send(self._progress)

    @property
    def label(self) -> Optional[UiText]:
        return self._progress.data.label

    @label.setter
    def label(self, value: Optional[UiText]):
        self._progress.data.label = value
        self._send_update()

    @property
    def max(self) -> Optional[float]:
        return self._progress.data.max

    @max.setter
    def max(self, value: Optional[float]):
        self._progress.data.max = value
        self._send_update()

    @property
    def value(self) -> Optional[float]:
        return self._progress.data.value

    @value.setter
    def value(self, value: Optional[float]):
        self._progress.data.value = value
        self._send_update()

    @property
    def completed(self) -> Optional[bool]:
        return self._progress.data.completed

    @completed.setter
    def completed(self, value: Optional[bool]):
        self._progress.data.completed = value
        self._send_update()

    def complete_when_task(self, task: Awaitable[Any], complete_text: Optional[UiText] = None):
        def on_complete():
            self.completed = True
            if complete_text is not None:
                self.label = complete_text
        watch(task, on_complete)