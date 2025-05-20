from dataclasses import dataclass
from typing import Any, Literal, Mapping
from ..command import UiText, ViewMessage


LogCommandType = Literal[
    "log.text", "log.log", "log.info", "log.warn", "log.error", "log.success"
]

@dataclass
class LogCommand(ViewMessage):
    data: UiText = ""

    def init(self, data: Mapping[str, Any]):
        super().init(data)
        self.data = data.get("data", self.data)

def is_log_command(message: ViewMessage) -> bool:
    return message.command in {
        "log.text", "log.log", "log.info", "log.warn", "log.error", "log.success"
    }

class LogNamespace:
    def text(self, text: UiText) -> LogCommand:
        return LogCommand(command="log.text", data=text)

    def log(self, text: UiText) -> LogCommand:
        return LogCommand(command="log.log", data=text)

    def info(self, text: UiText) -> LogCommand:
        return LogCommand(command="log.info", data=text)

    def warn(self, text: UiText) -> LogCommand:
        return LogCommand(command="log.warn", data=text)

    def error(self, text: UiText) -> LogCommand:
        return LogCommand(command="log.error", data=text)

    def success(self, text: UiText) -> LogCommand:
        return LogCommand(command="log.success", data=text)


log = LogNamespace()