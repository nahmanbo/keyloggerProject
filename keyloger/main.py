import requests
import json

# המילון עם הנתונים שאתה רוצה לשלוח
new_data = {
    "12-8":0,
    "@": "מרדכי)0",  # כתובת ה-MAC
    "time": "2025-02-19",       # תאריך או זמן
    "name": "9879878jjjj",            # שם
    "age": 21,                  # גיל
    "location": "Tel Aviv"      # מקום
}
new_data["$"]=0

# ה-URL שלך, שבו השרת מאזין
url = "http://127.0.0.1:5000/upload"

# שליחת הבקשה עם המילון כ-JSON
requests.post(url, json=new_data)
