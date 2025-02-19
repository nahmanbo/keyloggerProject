import requests
from getmac import get_mac_address




class NetworkWriter:
    def __init__(self):
        self.url='http://localhost:5000/upload'
    def send_data(self,data, machine_name):
        #מציאת מספר mac של המשחב
        data["@"]= machine_name
        requests.post(self.url, json=data)


