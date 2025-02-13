from abc import ABC, abstractmethod
from typing import Dict

class KeyLoggerInterface(ABC):
    @abstractmethod
    def start_logging(self) -> None:
        pass

    @abstractmethod
    def stop_logging(self) -> None:
        pass

    @abstractmethod
    def get_logged_keys(self) -> Dict[str, str]:
        pass

    @abstractmethod
    def print_key_logs(self) -> None:
        pass
