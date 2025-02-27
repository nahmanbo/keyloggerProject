
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

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
    print((name_of_new_folder[:-4]),(file_name[:-4]))
    print(int(name_of_new_folder[-6:-4]),int(file_name[-6:-4]))

    # אם הזמן בין שני הקבצים עולה על 5 דקות, נפתח קובץ חדש
    # or
    if  (int(name_of_new_folder[-6:-4]) - int(file_name[-6:-4]) >1 )or(name_of_new_folder[:-6]) != (file_name[:-6]):
        print(name_of_new_folder, file_name)
        return True
    return False


# יצירת קובץ חדש
def create_file(file_name, new_data):
    """ יוצר קובץ חדש עם נתוני txt. """
    name_of_new_folder = f'{next(iter(new_data.keys()))}.txt'
    data = next(iter(new_data.values()))

    with open(get_file_path(file_name, name_of_new_folder), 'w', encoding='utf-8') as f:
        f.write(str(data))  # שמירה כטקסט ולא כ-JSON


@app.route('/upload', methods=['POST'])
def upload():
    """ מקבל נתונים ומעדכן את הקובץ המתאים. """
    new_data = request.get_json()

    file_name = new_data["@"]  # מזהה המחשב
    del new_data['@']  # הסרת המזהה ממילון הנתונים

    data_directory = get_file_path(file_name)

    if os.path.exists(data_directory):  # אם תיקיית המחשב קיימת
        name_of_new_folder = f'{next(iter(new_data.keys()))}.txt'  # תיקון: שינוי סיומת ל-.txt

        if check_if_open_new(file_name, name_of_new_folder):
            create_file(file_name, new_data)
        else:

            files = os.listdir(data_directory)
            latest_file = max((os.path.join(data_directory, f) for f in files), key=os.path.getmtime)
            name_of_latest_file = os.path.basename(latest_file)
            # קריאת תוכן הקובץ העדכני
            with open(get_file_path(file_name,name_of_latest_file ), 'a', encoding='utf-8') as f:
                f.write(next(iter(new_data.values())))  # מוסיף שורה חדשה עם הנתונים

    else:  # אם אין תיקיית מחשב, יוצרים חדשה
        os.makedirs(data_directory, exist_ok=True)
        create_file(file_name, new_data)

    return '', 204
#כל הפונקציות get
@app.route('/get_machines', methods=['GET'])
def get_machines():
     # הדפסה כדי לוודא שהבקשה הגיעה
    directories = {"machines": [d for d in os.listdir("data") if os.path.isdir(os.path.join("data", d))]}
    response = jsonify(directories)
      # הדפסת הנתונים שנשלחים חזרה ללקוח
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return response

@app.route('/get_by_name/<name>', methods=['GET'])
def get_by_name(name):
    data_directory=get_file_path(f'{name}')
    files_data = {}
    for file_name in os.listdir(data_directory):
        file_path = os.path.join(data_directory, file_name)
        with open(file_path, 'r', encoding='utf-8') as f:
            files_data[file_name] = f.read()
    return jsonify (files_data)

@app.route('/get_day_list/<name>', methods=['GET'])
def get_day_list(name):
    directory_path = get_file_path(name)
    file_list = []

    try:
        files = os.listdir(directory_path)
        if files:
            day = files[0][:10]
            file_list.append(day)
            for file in files:
                if file[:10] != day:
                    file_list.append(file[:10])
                    day = file[:10]
    except FileNotFoundError:
        return jsonify({"error": "Directory not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    response = jsonify({"days": file_list})
    response.headers.add("Access-Control-Allow-Origin", "*")  # הוספת תמיכה ב-CORS
    return response


@app.route('/get_hour_list/<name>/<day>', methods=['GET'])
def get_hour_list(name,day):
    file_list = []
    directory_path = get_file_path(f'{name}')
    files = os.listdir(directory_path)
    our=0

    if files:
        for file in files:
            if file[0:10]==day[0:10]and file[0:13]!=our:
                file_list.append(file[11:13]+":00")
                our = file[0:13]

    response = jsonify({"hours": file_list})
    response.headers.add("Access-Control-Allow-Origin", "*")  # הוספת תמיכה ב-CORS
    return response


from flask import jsonify

@app.route('/get_file_list/<name>/<day>/<our>', methods=['GET'])
def get_file_list(name, day, our):
    file_list = []
    directory_path = get_file_path(name)

    try:
        folders = os.listdir(directory_path)

        for folder in folders:
            if len(folder) < 16:  # 2025-02-26 17_51 (לפחות 16 תווים)
                continue

            folder_date = folder[:10]  # תאריך מתוך שם הקובץ
            folder_hour = folder[11:13]  # שעה מתוך שם הקובץ

            # התאמת פורמט השעה מהבקשה לפורמט השעה בקובץ (רק השעתיים הראשונות)
            request_hour = our[:2]  # ניקח רק "17" מתוך "17:00"

            if folder_date == day[:10] and folder_hour == request_hour:
                formatted_name = folder[11:-4].replace("_", ":")  # המרת _ ל-:
                file_list.append(formatted_name)
        response = jsonify({"files": file_list})  # יצירת JSON תקין
        response.headers.add("Access-Control-Allow-Origin", "*")  # הוספת תמיכה ב-CORS
        print(response)
        print(response.get_data(as_text=True))  # בדיקה מה מחזירים ללקוח

        return response

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/get_file_data/<name>/<date>/<time>', methods=['GET'])
def get_file_data(name, date, time):
    # המרת הפורמט של השעה כדי להתאים לשמות הקבצים
    formatted_time = time.replace(":", "_")
    file_name = f"{date} {formatted_time}.txt"

    print(f"Looking for file: {file_name}")

    # קבלת הנתיב של התיקיה
    directory_path = get_file_path(name)
    print(f"Directory path: {directory_path}")

    # בדיקה אם התיקיה קיימת
    if not os.path.isdir(directory_path):
        return jsonify({"error": "Directory not found"}), 404

    # יצירת הנתיב המלא של הקובץ
    full_file_path = get_file_path(name, file_name)

    # בדיקה אם הקובץ קיים
    if not os.path.isfile(full_file_path):
        return jsonify({"error": "File not found"}), 404

    try:
        # קריאת תוכן הקובץ והחזרתו
        with open(full_file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            print("File content:", content)  # הדפסת התוכן למסוף
            response = jsonify({"content": content})  # יצירת JSON תקין
            response.headers.add("Access-Control-Allow-Origin", "*")  # הוספת תמיכה ב-CORS
            print(response)
            print(response.get_data(as_text=True))  # בדיקה מה מחזירים ללקוח

            return response
    except Exception as e:
        print("Error reading file:", e)
        return jsonify({"error": "Failed to read file"}), 500



@app.route('/', methods=['GET'])

def show_data():
    day_dic={}
    files_data = {}
    data_directory = get_file_path("DESKTOP-8823H7O")
    day_now = ((os.listdir(data_directory))[0])

    for file_name in os.listdir(data_directory):
        file_path = os.path.join(data_directory, file_name)
        with open(file_path, 'r', encoding='utf-8') as f:
            if day_now !=file_name[0:10] :#and day_dic:
                day_dic[day_now[0:10]] =files_data
                files_data={}
                day_now=file_name[0:10]
                files_data[file_name] = f.read()
            else:

                files_data[file_name] = f.read()

        day_dic[day_now]=files_data[file_name]

    print(day_dic)

    return day_dic


if __name__ == '__main__':
    app.run(debug=True)