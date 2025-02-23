import requests
import json

# המילון עם הנתונים שאתה רוצה לשלוח
new_data = {
    "12_32":"---!",
    "@": "test",  # כתובת ה-MAC
    "time": "2025-02-19",       # תאריך או זמן
    "name": "9879878jjjj",            # שם
    "age":"jkn0999999999999999999999999999999999999999999999999999999999999999999999",                  # גיל
    "location": "ytytyt"      # מקום
}

# ה-URL שלך, שבו השרת מאזין
url = "http://192.168.150.143:5000/upload"

# שליחת הבקשה עם המילון כ-JSON
requests.post(url, json=new_data)
import json

# המידע שברצונך להוסיף
import os

# חזרה לתיקיית keylogger
# import os
#
# # חזרה לתיקיית keyloger (לא keylogger)
# parent_directory = os.path.abspath(os.path.join(os.getcwd(), '..'))
# file_path = os.path.join(parent_directory, 'keyloger', 'df.json')
#
# if os.path.isfile(file_path):
#     print("✅ הקובץ df.json נמצא!")
# else:
#     print("❌ הקובץ עדיין לא נמצא!")
# print(os.path.dirname(os.getcwd()))
# print("123456"[6-2:])
print("12345678"[:-2]=="12345678"[:-2])
r="12\n13"
r+=f"\n{r}"
print(r)