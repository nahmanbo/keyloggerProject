# def xor_encrypt_decrypt(text: str, key: str) -> str:
#     """מצפין או מפענח מחרוזת באמצעות XOR עם מפתח"""
#     encrypted = ''.join(chr(ord(c) ^ ord(key[i % len(key)])) for i, c in enumerate(text))
#     return encrypted
#
# # הצפנה
# key = "mykey"
# message = "Hello, XOR!"
# encrypted_message = xor_encrypt_decrypt(message, key)
# print(f"Encrypted: {encrypted_message}")
#
# # פענוח (אותה פעולה בדיוק)
# decrypted_message = xor_encrypt_decrypt(encrypted_message, key)
# print(f"Decrypted: {decrypted_message}")

from app import Flask, jsonify
from flask_cors import CORS

import os
import base64

class XORCipher:
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


    @staticmethod
    def get_info(buffer):
        info = ""
        for timestamp, events in buffer.items(): # timestamp = time, events = list[tuples]
            info += str(timestamp) + " | "
            for window, keystroke in events: # goes directly over each tuple
                info += f"[{window}] {keystroke} | "
        return info.strip() # removes extra spaces at the end


    def encrypt(self, plaintext: str) -> str:
        """XOR encryption"""
        plaintext_bytes = plaintext.encode()
        key_repeated = (self.key * (len(plaintext_bytes) // len(self.key) + 1))[:len(plaintext_bytes)]
        encrypted_bytes = bytes([b ^ k for b, k in zip(plaintext_bytes, key_repeated)])
        return base64.b64encode(encrypted_bytes).decode()  # Base64 encoding for secure sending

    def decrypt(self, encrypted_text: str) -> str:
        """XOR decoding"""
        encrypted_bytes = base64.b64decode(encrypted_text)
        key_repeated = (self.key * (len(encrypted_bytes) // len(self.key) + 1))[:len(encrypted_bytes)]
        decrypted_bytes = bytes([b ^ k for b, k in zip(encrypted_bytes, key_repeated)])
        return decrypted_bytes.decode()

# Create a class with a fixed key (if none, a new key will be created)
cipher = XORCipher()

#  encryption exemple
plaintext = "Hello, Secure XOR!"
encrypted_text = cipher.encrypt(plaintext)
print(f"Encrypted: {encrypted_text}")

#  decoding exemple
decrypted_text = cipher.decrypt(encrypted_text)
print(f"Decrypted: {decrypted_text}")
