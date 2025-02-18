from flask import Flask, request, json, render_template
import os

app = Flask(__name__)

# שם הקובץ שבו נשמור את הנתונים
DATA_FILE = 'data.json'

@app.route('/upload', methods=['POST'])
def upload():


    new_data = request.get_json()



    # טוען את המידע הקיים או מתחיל מרשימה ריקה
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r') as f:
                data = json.load(f)
        else:
            data = []
    except (json.JSONDecodeError, FileNotFoundError):
        data = []

    # מוסיף את המידע החדש
    data.append(new_data)

    # שומר את המידע המעודכן בקובץ JSON
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

    return f"<h1>המידע נשמר בהצלחה!</h1><p>המידע החדש שהוזן: {new_data}</p>"

@app.route('/', methods=['GET'])
def show_data():
    # טוען את המידע מקובץ JSON
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r') as f:
                data = json.load(f)
        else:
            data = []
    except (json.JSONDecodeError, FileNotFoundError):
        data = []

    # מציג את המידע מהקובץ
    return render_template('index.html', data=data)


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)