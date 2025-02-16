import os
import base64
import json
from itertools import cycle


class Encryptor:
    """A simple XOR-based encryption class"""

    KEY_FILE = "key.bin"
    KEY_SIZE = 32  # Size of the encryption key in bytes

    def __init__(self):
        """Initialize the class by loading or generating a key"""
        self.key = self._load_or_generate_key()

    def _load_or_generate_key(self) -> bytes:
        """Loads an existing key or generates a new one if it does not exist."""
        if os.path.exists(self.KEY_FILE):
            try:
                with open(self.KEY_FILE, "rb") as file:
                    key = file.read()
                    if len(key) != self.KEY_SIZE:
                        raise ValueError("Invalid key size, regenerating key...")
                    return key
            except (OSError, ValueError):
                pass  # If there's an error reading, generate a new key

        key = os.urandom(self.KEY_SIZE)  # Generate a secure random key
        with open(self.KEY_FILE, "wb") as file:
            file.write(key)
        return key

    def _xor_process(self, data: bytes) -> bytes:
        """Applies XOR operation using a cyclic key"""
        return bytes(b ^ k for b, k in zip(data, cycle(self.key)))

    def encrypt(self, data: dict) -> str:
        """Encrypts a dictionary using XOR and returns a base64-encoded string"""
        try:
            json_str = json.dumps(data, ensure_ascii=False)  # Convert to JSON string
            encrypted_bytes = self._xor_process(json_str.encode())  # Apply XOR
            return base64.b64encode(encrypted_bytes).decode()  # Encode to base64
        except (TypeError, ValueError) as e:
            raise ValueError(f"Encryption failed: {e}")

    def decrypt(self, encrypted_text: str) -> dict:
        """Decrypts a base64-encoded XOR-encrypted string back into a dictionary"""
        try:
            encrypted_bytes = base64.b64decode(encrypted_text)  # Decode base64
            decrypted_bytes = self._xor_process(encrypted_bytes)  # Apply XOR
            return json.loads(decrypted_bytes.decode())  # Convert back to dict
        except (json.JSONDecodeError, UnicodeDecodeError, ValueError) as e:
            raise ValueError(f"Decryption failed: {e}")


if __name__ == "__main__":
    data = {
        "12:30:45": {
            "Browser": ["H", "e", "l", "l", "o"],
            "Terminal": ["c", "d", " ", "/", "u"],
            "Editor": ["T", "e", "s", "t"]
        },
        "12:31:10": {
            "Editor": ["T", "h", "i", "s", " ", "i", "s", " ", "a", " ", "t", "e", "s", "t"]
        },
        "12:32:05": {
            "Terminal": ["p", "y", "t", "h", "o", "n"],
            "Chat": ["H", "i", " ", "t", "h", "e", "r", "e", "!"]
        },
        "12:33:15": {
            "File Explorer": ["C", ":", "\\", "U", "s", "e", "r", "s"],
            "IDE": ["p", "r", "o", "j", "e", "c", "t"]
        },
        "12:35:00": {
            "Browser": ["G", "o", "o", "g", "l", "e", ".", "c", "o", "m"],
            "Terminal": ["l", "s", " ", "-", "a"]
        }
    }

    encryptor = Encryptor()

    encrypted_text = encryptor.encrypt(data)
    print(f"Encrypted: {encrypted_text}")

    decrypted_data = encryptor.decrypt(encrypted_text)
    print(f"Decrypted: {decrypted_data}")

    assert decrypted_data == data, "Decryption did not return the original data!"
