from flask import Flask, request, json
import os

app = Flask(__name__)

# שם הקובץ שבו נשמור את הנתונים


@app.route('/upload', methods=['POST'])
def upload():

    new_data = request.get_json()#מקבל את הנתונים וזה מסוג מילון

    file_name=new_data["@"]#'#זה זיהוי המחשב שממנו שלח המידע מספרוגם שם התקיה שלו mac

    data_directory = os.path.join('data', file_name)#יוצר ליתנתיב שצריך בשיבל לתוך תתקיה
    if  os.path.exists(data_directory):
        print("----------------------------------------------------")
        del new_data['@']
        name_of_new_folder=next(iter(new_data.keys()))

        with open(f"data/{file_name}/{name_of_new_folder}", 'w', encoding='utf-8') as f:
            json.dump(new_data, f, ensure_ascii=False, indent=4)
    else:
        data_directory = os.path.join('data',new_data["@"] )
        print(data_directory)

        os.makedirs(data_directory,exist_ok=True)
        del new_data['@']
        name_of_new_folder = next(iter(new_data.keys()))

        with open(f"data/{file_name}/{name_of_new_folder}", 'w', encoding='utf-8') as f:
            json.dump(new_data, f, ensure_ascii=False, indent=4)
    return  '', 204






        








#
@app.route('/', methods=['GET'])
def show_data():
    return "עדיין בפיתול1000000000000000000000000000000000000000000000000/n/\n]\n\n\n\n\n\neeeeeeeeeeere"
#     # טוען את המידע מקובץ JSON
#     # try:
#     #     if os.path.exists(DATA_FILE):
#     #         with open(DATA_FILE, 'r') as f:
#     #             data = json.load(f)
#     #     else:
#     #         data = []
#     # except (json.JSONDecodeError, FileNotFoundError):
#     #     data = []
#     #
#     # # מציג את המידע מהקובץ
#     # return ender_template('index.html', data=data)
#


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)