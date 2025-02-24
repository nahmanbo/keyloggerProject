# from math import trunc
# from tkinter.font import names
#
# from flask import Flask, request, json
# import os
#
# app = Flask(__name__)
#
# # שם הקובץ שבו נשמור את הנתונים
#
#
# @app.route('/upload', methods=['POST'])
# def upload():
#     new_data = request.get_json()#מקבל את הנתונים וזה מסוג מילון
#     file_name=new_data["@"]#'#זה זיהוי המחשב שממנו שלח המידע מספרוגם שם התקיה שלו mac
#     del new_data['@']
#
#     data_directory = os.path.join('data', file_name)#יוצר ליתנתיב שצריך בשיבל לתוך תתקיה
#     if  os.path.exists(data_directory):#אם התקיה בשם ששלח במפתח של השטרודל קיים זה אומר שיש תקיה כזאת
#         name_of_new_folder=next(iter(new_data.keys()))#מקבל את המפתח הראשון הראשון שהוא ישמש בתור השם אם יש משהוא בטווח של 5 דקות
#         #להוסיף אם קיים קובת בשינוי של חמש דק מזה
#         if check_if_open_new(file_name,name_of_new_folder):
#             creat_file(file_name, new_data)
#         else:
#             files = os.listdir(f"data/{file_name}")
# #[f for f in os.listdir(f"data/{file_name}") if os.path.isfile(os.path.join(f"data/{file_name}", f))]
#             latest_file = max((os.path.join(f"data/{file_name}", f) for f in files), key=os.path.getmtime)
#             name_of_latest_file=os.path.basename(latest_file)
#             with open(f"data/{file_name}/{name_of_latest_file}", 'r', encoding='utf-8') as f:
#                 data = json.load(f)  # קריאת תוכן JSON
#             new_data = next(iter(new_data.values()))
#             data += f"\n + {new_data}"  # מוסיף את new_data בשורה חדשה
#             with open(f"data/{file_name}/{name_of_latest_file}", 'w', encoding='utf-8') as f:
#                 json.dump(data, f, ensure_ascii=False, indent=4)
#     else:#אם קיים כבר מחשב אז הוא יוצר תקיה חדשה עם השם המחשב שלו
#         data_directory = os.path.join('data',file_name )
#         os.makedirs(data_directory,exist_ok=True)
#         creat_file(file_name,new_data)#יוצר קובץ חדש
#
#     return  '', 204
# def check_if_open_new(file_name_,name_of_new_flder):#
#     data_directory = os.path.join( 'data', file_name_)
#
#     files = os.listdir(f"data/{file_name_}")
#     if not files:
#         return True
#     latest_file = max((os.path.join(data_directory, f) for f in files), key=os.path.getmtime)#מציאת הקובץ הארחון שנכנס
#     print(latest_file)
#     file_name = os.path.basename(latest_file)#מצאית השם של הקובץ שנמצא
#     if  (name_of_new_flder[:-2]) != (file_name[:-2]) or(int(name_of_new_flder[-2:])-int(file_name[-2:]))>4:#בשביל הסדר נעשה שכל חמש דק פותח חדש ובמקרה שעברה השעה שבה נוצר הקובץ האחרון
#         return True
#     else:
#         return False
#
# def creat_file(file_name,new_data):
#     name_of_new_folder = next(iter(new_data.keys()))  # לוקח את המפתח הראשון שזה הזמן ונותן שם לקובץ לפי הזמן
#     new_data = next(iter(new_data.values()))
#     with open(f"data/{file_name}/{name_of_new_folder}", 'w', encoding='utf-8') as f:
#         json.dump(new_data, f, ensure_ascii=False, indent=4)
#
# #
# @app.route('/', methods=['GET'])
# def show_data():
#     return "עדיין בפיתול1000000000000000000000000000000000000000000000000/n/\n]\n\n\n\n\n\neeeeeeeeeeere"
# if __name__ == '__main__':
#     app.run(host='0.0.0.0', debug=True)

from flask import Flask, request, json
import os

app = Flask(__name__)


# שמירה על נתיב הקבצים
def get_file_path(file_name, folder_name=None):
    """ מחזיר את הנתיב המלא לקובץ בתיקיית 'data'. """
    return os.path.join('data', file_name, folder_name) if folder_name else os.path.join('data', file_name)


# בודק אם יש לפתוח קובץ חדש
def check_if_open_new(file_name, name_of_new_folder):
    """ בודק אם יש צורך לפתוח קובץ חדש על פי זמן השינוי. """
    data_directory = get_file_path(file_name)

    files = os.listdir(data_directory)
    if not files:  # אם אין קבצים בתיקיה
        return True

    latest_file = max((os.path.join(data_directory, f) for f in files), key=os.path.getmtime)
    file_name = os.path.basename(latest_file)

    # אם הזמן בין שני הקבצים עולה על 5 דקות, נפתח קובץ חדש
    if (name_of_new_folder[:-2]) != (file_name[:-2]) or int(name_of_new_folder[-2:]) - int(file_name[-2:]) > 4:
        return True
    return False


# יצירת קובץ חדש
def create_file(file_name, new_data):
    """ יוצר קובץ חדש עם נתוני JSON. """
    name_of_new_folder = next(iter(new_data.keys()))
    data = next(iter(new_data.values()))

    with open(get_file_path(file_name, name_of_new_folder), 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)


@app.route('/upload', methods=['POST'])
def upload():
    """ מקבל נתונים ומעדכן את הקובץ המתאים. """
    new_data = request.get_json()

    file_name = new_data["@"]  # מזהה המחשב
    del new_data['@']  # הסרת המזהה ממילון הנתונים

    data_directory = get_file_path(file_name)

    if os.path.exists(data_directory):  # אם תיקיית המחשב קיימת
        name_of_new_folder = next(iter(new_data.keys()))

        if check_if_open_new(file_name, name_of_new_folder):
            create_file(file_name, new_data)
        else:
            files = os.listdir(data_directory)
            latest_file = max((os.path.join(data_directory, f) for f in files), key=os.path.getmtime)
            name_of_latest_file = os.path.basename(latest_file)

            # קריאת תוכן הקובץ העדכני
            with open(os.path.join(data_directory, name_of_latest_file), 'r', encoding='utf-8') as f:
                data = json.load(f)

            # עדכון הנתונים בקובץ
            new_data = next(iter(new_data.values()))
            data += f"\n + {new_data}"

            with open(os.path.join(data_directory, name_of_latest_file), 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=4)
    else:  # אם אין תיקיית מחשב, יוצרים חדשה
        os.makedirs(data_directory, exist_ok=True)
        create_file(file_name, new_data)

    return '', 204


@app.route('/', methods=['GET'])
def show_data():
    return "שרת פועל כרגיל."


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
