import asyncio
import sys
import threading
from typing import Dict, TypeVar
from .utils import message_from_string, message_to_string
from .command import ViewMessage

MessageT = TypeVar('MessageT', bound=ViewMessage)

class ResponseHandler:
    def __init__(self):
        self.command_map: Dict[str, tuple[asyncio.AbstractEventLoop, asyncio.Future]] = {}
        self.lock = threading.Lock()
        self.reader_thread = threading.Thread(target=self._read_stdin_thread, daemon=True)
        self.reader_thread.start()

    def _read_stdin_thread(self):
        for line in sys.stdin:
            decoded = line.strip()
            self._handle_line(decoded)

    def _handle_line(self, decoded: str):
        try:
            message = message_from_string(decoded)
            if not message:
                return

            command_id = message.commandId
            if not command_id:
                return

            with self.lock:
                entry = self.command_map.pop(command_id, None)

            if entry:
                loop, future = entry
                # Set result in the correct loop's thread
                loop.call_soon_threadsafe(future.set_result, message)

        except Exception as e:
            print("Failed to process line:", e)

    async def send(self, message: MessageT) -> MessageT:
        loop = asyncio.get_running_loop()
        future = loop.create_future()

        with self.lock:
            self.command_map[message.commandId] = (loop, future)

        send(message)
        return await future

response_handler = ResponseHandler()

def send(message: MessageT) -> MessageT:
    print(message_to_string(message), flush=True)
    return message