// פונקציות תצוגה ושעון
function updateClock() {
    document.getElementById("clock").textContent = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function startClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

// הודעות המערכת - מרוכזות במשתנים
const MESSAGES = {
    connecting: "🛰️ מתחבר לשרת",
    connected: "✅ החיבור לשרת הושלם. בחר מחשב",
    noMachines: "לא נמצאו מחשבים",
    machineSelected: (name) => `🖥️ מחשב "${name}" נבחר. מחפש נתונים`,
    machineDataFound: (name) => `🗂️ נמצאו נתונים עבור "${name}". בחר יום`,
    noMachineData: (name) => `לא נמצאו נתונים עבור המחשב "${name}"`,
    searchingData: (machine, day) => `⏳ מחפש נתונים עבור "${machine}" ביום "${day}"`,
    dataFound: "🗂️ נמצאו נתונים. בחר שעה",
    noDayData: (machine, day) => `לא נמצאו נתונים עבור המחשב "${machine}" בתאריך ${day}`,
    searchingHourData: (machine, day, hour) => `⏳ מחפש נתונים עבור "${machine}" ביום "${day}" בשעה ${hour}`,
    noHourData: (machine, day, hour) => `לא נמצאו נתונים עבור המחשב "${machine}" בתאריך ${day} בשעה ${hour}`,
    loadingFile: (file) => `📡 טוען נתונים מהקובץ ${file}`,
    redirecting: "🔍 מעבר לעמוד הנתונים",
    errorFetch: (error) => `⚠️ אירעה תקלה בעת השליפה: ${error.message}`,
    welcome: (name) => `ברוך הבא ${name}!`
};

// פונקציה להצגת הודעה
function showMessage(message, container, options = {}) {
    const defaults = { newLine: false, separator: " → ", clear: false };
    const settings = { ...defaults, ...options };
    
    if (settings.clear) {
        const existingMessages = container.querySelectorAll('.message');
        existingMessages.forEach(msg => container.removeChild(msg));
    }
    
    const existingMessage = container.querySelector('.message:last-child');
    if (settings.newLine || !existingMessage) {
        const messageElement = document.createElement('p');
        messageElement.classList.add('message');
        messageElement.textContent = message;
        container.appendChild(messageElement);
    } else {
        existingMessage.textContent += settings.separator + message;
    }
    
    return new Promise(resolve => setTimeout(resolve, 500));
}

// פונקציה לשליפת נתונים והצגתם
async function fetchData(url, successCallback, errorMessage, container, messageOptions) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`שגיאת שרת: ${response.status}`);
        
        const data = await response.json();
        if (data && ((data.machines && data.machines.length > 0) || 
                     (data.days && data.days.length > 0) || 
                     (data.hours && data.hours.length > 0) || 
                     (data.files && data.files.length > 0) ||
                     data.content)) {
            successCallback(data);
            return true;
        } else {
            showMessage(`❌ ${errorMessage}`, container, messageOptions);
            return false;
        }
    } catch (error) {
        console.error("שגיאה:", error);
        showMessage(MESSAGES.errorFetch(error), container, messageOptions);
        return false;
    }
}

// יצירת תפריטים
function createMenu(container, items, itemClass, clickHandler) {
    const menu = document.createElement("div");
    menu.classList.add("menu-erea", itemClass);
    
    items.forEach(item => {
        const button = document.createElement("button");
        button.textContent = item;
        button.classList.add("menu-button");
        button.onclick = () => clickHandler(item);
        menu.appendChild(button);
    });
    
    container.appendChild(menu);
}

// פונקציות ניהול בקשות
async function fetchMachines(container) {
    await showMessage(MESSAGES.connecting, container, { clear: true });
    
    fetchData(
        'http://127.0.0.1:5000/get_machines',
        (data) => {
            showMessage(MESSAGES.connected, container);
            createMenu(container, data.machines, "menu-machines", (machine) => fetchDay(container, machine));
        },
        MESSAGES.noMachines,
        container
    );
}

async function fetchDay(container, machineName) {
    await showMessage(MESSAGES.machineSelected(machineName), container, { newLine: true });
    
    fetchData(
        `http://127.0.0.1:5000/get_day_list/${machineName}`,
        (data) => {
            showMessage(MESSAGES.machineDataFound(machineName), container);
            createMenu(container, data.days, "menu-day", (day) => fetchHour(container, machineName, day));
        },
        MESSAGES.noMachineData(machineName),
        container
    );
}

async function fetchHour(container, machineName, selectedDay) {
    await showMessage(MESSAGES.searchingData(machineName, selectedDay), container, { newLine: true });
    
    fetchData(
        `http://127.0.0.1:5000/get_hour_list/${machineName}/${selectedDay}`,
        (data) => {
            showMessage(MESSAGES.dataFound, container);
            createMenu(container, data.hours, "menu-hour", (hour) => fetchFile(container, machineName, selectedDay, hour));
        },
        MESSAGES.noDayData(machineName, selectedDay),
        container
    );
}

async function fetchFile(container, machineName, selectedDay, selectedHour) {
    await showMessage(MESSAGES.searchingHourData(machineName, selectedDay, selectedHour), container, { newLine: true });
    
    fetchData(
        `http://127.0.0.1:5000/get_file_list/${machineName}/${selectedDay}/${selectedHour}`,
        (data) => {
            showMessage(MESSAGES.dataFound, container);
            createMenu(container, data.files, "menu-file", (file) => fetchFileData(container, machineName, selectedDay, selectedHour, file));
        },
        MESSAGES.noHourData(machineName, selectedDay, selectedHour),
        container
    );
}

async function fetchFileData(container, machineName, selectedDay, selectedHour, selectedFile) {
    await showMessage(MESSAGES.loadingFile(selectedFile), container, { newLine: true });
    
    fetchData(
        `http://127.0.0.1:5000/get_file_data/${machineName}/${selectedDay}/${selectedFile}`,
        (data) => {
            if (data.content) {
                showMessage(MESSAGES.redirecting, container);
                const encodedData = encodeURIComponent(data.content);
                window.location.href = `data.html?encryptedData=${encodedData}`;
            }
        },
        MESSAGES.noHourData(machineName, selectedDay, selectedHour),
        container
    );
}

// אתחול הדף
document.addEventListener('DOMContentLoaded', async function() {
    const username = localStorage.getItem('username');
    document.getElementById('username').textContent = `🔒${username}`;

    const loginMessage = document.querySelector('.login-message');
    const messageContainer = document.getElementById('message-container');

    startClock();

    loginMessage.style.display = 'block';
    messageContainer.style.display = 'none';

    // יצירת MutationObserver לגלילה אוטומטית
    const observer = new MutationObserver(() => {
        messageContainer.scrollTop = messageContainer.scrollHeight;
    });

    // התחלת ההאזנה לשינויים ב-messageContainer
    observer.observe(messageContainer, { childList: true, subtree: true });

    setTimeout(async () => {
        loginMessage.style.display = 'none';
        messageContainer.style.display = 'block';

        await showMessage(MESSAGES.welcome(username), messageContainer, { clear: true });
        await fetchMachines(messageContainer);
    }, 1000);
});

