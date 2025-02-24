import requests

class NetworkWriter:
    def __init__(self):
        self.url='http://127.0.0.1:5000/upload'
    def send_data(self,data, machine_name):
        data["@"]= machine_name
        requests.post(self.url, json=data)


