from abc import ABC, abstractmethod
from typing import List

class KeyLoggerInterface(ABC):
    @abstractmethod
    def start_logging(self) -> None:
        """מתחיל רישום של מקשים"""
        pass

    @abstractmethod
    def stop_logging(self) -> None:
        """מפסיק רישום של מקשים"""
        pass

    @abstractmethod
    def get_logged_keys(self) -> List[str]:
        """מחזיר רשימה של המקשים שנרשמו"""
        pass
