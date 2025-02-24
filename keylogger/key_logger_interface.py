from abc import ABC, abstractmethod
from typing import Dict

class KeyLoggerInterface(ABC):
    """
    Interface for a keylogger system.
    Methods:
        start_logging: Starts logging keyboard input.
        stop_logging: Stops logging keyboard input.
        get_logged_keys: Returns a nested dictionary containing logged keys.
        get_machine_name: Returns the name of the machine.
        reset_logs: Resets the key logs dictionary.
    """

    @abstractmethod
    def start_logging(self) -> None:
        """Starts logging keyboard input."""
        pass

    @abstractmethod
    def stop_logging(self) -> None:
        """Stops logging keyboard input."""
        pass

    @abstractmethod
    def get_logged_keys(self) -> Dict[str, Dict[str, str]]:
        """Retrieves logged keys.

        Returns:
            Dict[str, Dict[str, str]]:
                A dictionary where:
                - The key is `log_time` (str), representing the **minute** when the key press data was captured (e.g., "12:34").
                - The value is another dictionary with:
                    - The application name (str) as the key.
                    - The logged keys (str) as the value.
        """
        pass

    @abstractmethod
    def get_machine_name(self) -> str:
        """Retrieves the name of the machine."""
        pass

    @abstractmethod
    def reset_logs(self) -> None:
        """Resets the key logs dictionary."""
        pass
