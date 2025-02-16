import os
import base64
import json


class Encryptor:
    def __init__(self, key_path="key.bin", key_size=32):
        """Initializing the class with a fixed key"""
        self.key_path = key_path
        self.key_size = key_size
        self.key = self.load_or_generate_key()


    def load_or_generate_key(self):
        """Loads an existing key or creates a new one if it does not exist."""
        if os.path.exists(self.key_path):
            with open(self.key_path, "rb") as f:
                return f.read()
        else:
            key = os.urandom(self.key_size)  # create a strong key
            with open(self.key_path, "wb") as f:
                f.write(key)
            return key


    def encrypt(self, buffer: dict) -> str:
        """XOR encryption"""
        json_data = json.dumps(buffer, ensure_ascii=False)  # Convert buffer to JSON string
        plaintext_bytes = json_data.encode()
        key_repeated = (self.key * (len(plaintext_bytes) // len(self.key) + 1))[:len(plaintext_bytes)]
        encrypted_bytes = bytes([b ^ k for b, k in zip(plaintext_bytes, key_repeated)])
        return base64.b64encode(encrypted_bytes).decode()  # Base64 encoding for secure sending


    def decrypt(self, encrypted_text: str) -> dict:
        """XOR decoding"""
        encrypted_bytes = base64.b64decode(encrypted_text)
        key_repeated = (self.key * (len(encrypted_bytes) // len(self.key) + 1))[:len(encrypted_bytes)]
        decrypted_bytes = bytes([b ^ k for b, k in zip(encrypted_bytes, key_repeated)])
        json_data = decrypted_bytes.decode()
        return json.loads(json_data)


buffer = {
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

cipher = Encryptor()
encrypted_text = cipher.encrypt(buffer)
print(buffer)
print(f"Encrypted: {encrypted_text}")

#  decoding exemple
decrypted_text = cipher.decrypt(encrypted_text)
print(f"Decrypted: {decrypted_text}")