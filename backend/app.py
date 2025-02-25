from flask import Flask, request, json, jsonify
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
    """ יוצר קובץ חדש עם נתוני JSON. """
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
            print("=======================++==================")
        else:

            files = os.listdir(data_directory)
            latest_file = max((os.path.join(data_directory, f) for f in files), key=os.path.getmtime)
            name_of_latest_file = os.path.basename(latest_file)
            # קריאת תוכן הקובץ העדכני
            with open(get_file_path(file_name,name_of_latest_file ), 'a', encoding='utf-8') as f:
                f.write('\n' + str(new_data))  # מוסיף שורה חדשה עם הנתונים


    else:  # אם אין תיקיית מחשב, יוצרים חדשה
        os.makedirs(data_directory, exist_ok=True)
        create_file(file_name, new_data)

    return '', 204
#כל הפונקציות get
@app.route('/get_machine_name', methods=['GET'])
def get_machine_name():
    print("Getting machine names...")  # הדפסה כדי לוודא שהבקשה הגיעה
    directories = {"names": [d for d in os.listdir("data") if os.path.isdir(os.path.join("data", d))]}
    response = jsonify(directories)
    print(directories)  # הדפסת הנתונים שנשלחים חזרה ללקוח
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

@app.route('/', methods=['GET'])
def show_data():
    return "שרת פועל כרגיל."


if __name__ == '__main__':
    app.run(debug=True)
