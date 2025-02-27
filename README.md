# **KeyLogger Project**  

This project is a keylogger application that captures keystrokes and sends the data to a backend server for storage and retrieval.  
The backend server is built using Flask and provides multiple API endpoints to interact with the logged data.  
A web-based frontend interface allows users to view and manage the collected logs.  

---

## 📂 **Project Structure**  

```
📦 keylogger-project  
├── backend/                   # Backend server (Flask)  
│   ├── app.py                 # Main Flask application  
│   ├── requirements.txt        # Dependencies for the backend  
├── KeyLoggerAgent/             # Keylogger agent  
│   ├── keyLoggerManager.py     # Manages the keylogger service and data transmission  
│   ├── keyLoggerService.py     # Implements the keylogger functionality  
│   ├── encryptor.py            # Provides encryption and decryption for the logged data  
│   ├── fileWriter.py           # Writes logged data to a file  
│   ├── networkWriter.py        # Sends logged data to the backend server  
│   ├── buffer.py               # Implements a buffer for storing logged data  
│   ├── interfaceManager.py     # Manages the keylogger’s user interface  
├── frontend/                   # Frontend web interface  
│   ├── index.html              # Main page to display the list of machines  
│   ├── login.html              # Login page to access keylogger data  
│   ├── machine.html            # Page to display logs for a specific machine  
│   ├── style.css               # CSS file for styling the frontend  
│   ├── index.js                # JavaScript file for frontend logic  
├── .gitignore                  # Specifies files and directories to be ignored by Git  
├── README.md                   # Documentation file  
```  

---

## ⚙️ **Requirements**  

Make sure you have the following dependencies installed before running the project:  

### **Backend Requirements**  
- Python 3.x  
- Flask  
- Flask-CORS  
- pynput  
- getmac  
- requests  

To install the required dependencies, run:  
```bash
pip install -r backend/requirements.txt
```

---

## 🚀 **Installation & Usage**  

### **1️⃣ Clone the Repository**  
```bash
git clone https://github.com/yourusername/keylogger-project.git
cd keylogger-project
```

---

### **2️⃣ Running the Backend Server**  
Navigate to the backend directory:  
```bash
cd backend
```
Run the Flask application:  
```bash
python app.py
```
The server will start running at `http://127.0.0.1:5000/`.

---

### **3️⃣ Running the KeyLogger Agent**  
Navigate to the KeyLoggerAgent directory:  
```bash
cd KeyLoggerAgent
```
Run the keylogger manager:  
```bash
python keyLoggerManager.py
```

---

### **4️⃣ Running the Frontend Application**  
Navigate to the frontend directory:  
```bash
cd frontend
```
Open the `login.html` file in a web browser:  
```bash
start login.html  # Windows  
open login.html   # macOS  
xdg-open login.html  # Linux  
```

---

## 🔗 **API Endpoints**  

The backend provides the following API endpoints:  

| Method | Endpoint           | Description                           |  
|--------|-------------------|--------------------------------------|  
| `POST` | `/upload`         | Receives and stores keylogger data  |  
| `GET`  | `/logs`           | Retrieves all stored keylogs        |  
| `GET`  | `/logs/<machine>` | Retrieves logs for a specific machine |  

---

## ⚠️ **Legal Disclaimer**  
This project is for **educational purposes only**.  
Using a keylogger on any system without **explicit permission** may violate **privacy laws** and can lead to legal consequences.  

---

## 📞 **Contact & Contributions**  
If you have any suggestions or improvements, feel free to open an **issue** or submit a **pull request** on [GitHub](https://github.com/yourusername/keylogger-project). 🚀  

