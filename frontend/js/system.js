// פונקציה לעדכון השעון
function updateClock() {
    const clock = document.getElementById("clock");
    const now = new Date();
    clock.textContent = now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// התחלת שעון עם עדכון כל שניה
function startClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

// פונקציות עזר להצגת והסתרת אלמנטים
function toggleElements(elements, action) {
    elements.forEach(element => element.style.display = action);
}

// פונקציה להצגת הודעה עם אפקט הקלדה
async function showMessage(message, container) {
    return new Promise(resolve => {
        typeMessageEffect(message, container);
        setTimeout(resolve, message.length * 50);
    });
}

// פונקציה לעיכוב
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// פונקציה לחיבור לשרת וטעינת מחשבים
async function fetchMachines(container) {
    try {
        await showMessage("🛰️ מתחבר לשרת לקבלת נתונים...", container);
        const response = await fetch('http://127.0.0.1:5000/get_machines');
        const data = await response.json();
        await wait(4000);

        if (data && data.machines.length > 0) {
            await showMessage("✅ החיבור לשרת הושלם בהצלחה. ", container);
            await wait(1000);
            createMachinesMenu(container, data.machines);
            await showMessage("⏳ בחר מחשב מהרשימה:", container);
        } else {
            await showMessage("❌ לא נמצאו מחשבים.", container);
        }
    } catch (error) {
        console.error("שגיאה בעת חיפוש רשימת מחשבים:", error);
        await showMessage("⚠️ אירעה תקלה בעת השליפה. אנא נסה שוב מאוחר יותר.", container);
    }
}

// יצירת תפריט מחשבים
function createMachinesMenu(container, machines) {
    const menuMachines = document.createElement("div");
    menuMachines.classList.add("menu-erea", "menu-machines");

    machines.forEach(machine => {
        const button = document.createElement("button");
        button.textContent = machine;
        button.classList.add("menu-button");
        button.onclick = () => fetchDay(container, machine);
        menuMachines.appendChild(button);
    });

    container.appendChild(menuMachines);
}

// פונקציה לחיפוש נתונים לפי יום
async function fetchDay(container, machineName) {
    await showMessage(`🖥️🔍המחשב "${machineName}" נבחר. מבצע חיפוש נתונים...`, container);

    try {
        const response = await fetch(`http://127.0.0.1:5000/get_day_list/${machineName}`);
        const data = await response.json();

        if (data && data.days.length > 0) {
            await showMessage(`🗂️ נתונים עבור המחשב "${machineName}" נמצאו. מציג את הנתונים כעת...`, container);
            createDayMenu(container, machineName, data.days);
            await showMessage("⏳ בחר יום כדי להציג את הנתונים, או הקש F כדי להציג את כל הנתונים עבור המחשב.", container);
        } else {
            await showMessage(`❌ לא נמצאו נתונים עבור המחשב "${machineName}".`, container);
        }
    } catch (error) {
        console.error("שגיאה בעת חיפוש נתוני המחשב:", error);
        await showMessage("⚠️ אירעה תקלה בעת השליפה. אנא נסה שוב מאוחר יותר.", container);
    }
}

// יצירת תפריט ימים
function createDayMenu(container, machineName, days) {
    const menuFiles = document.createElement("div");
    menuFiles.classList.add("menu-erea", "menu-day");

    days.forEach(day => {
        const button = document.createElement("button");
        button.textContent = day;
        button.classList.add("menu-button");
        button.onclick = () => fetchHour(container, machineName, day);
        menuFiles.appendChild(button);
    });

    container.appendChild(menuFiles);
}

// פונקציה לחיפוש נתונים לפי שעה
async function fetchHour(container, machineName, selectedDay) {
    await showMessage(`⏳ מבצע חיפוש נתונים עבור "${machineName}" ביום "${selectedDay}"...`, container);

    try {
        const response = await fetch(`http://127.0.0.1:5000/get_hour_list/${machineName}/${selectedDay}`);
        const data = await response.json();

        if (data && data.hours.length > 0) {
            await showMessage(`🗂️ נתונים עבור המחשב "${machineName}" בתאריך ${selectedDay} נמצאו. מציג את הנתונים כעת...`, container);
            createHourMenu(container, machineName, selectedDay, data.hours);
            await showMessage("⏳ בחר שעה כדי להציג את הנתונים, או הקש F כדי להציג את כל הנתונים עבור המחשב.", container);
        } else {
            await showMessage(`❌ לא נמצאו נתונים עבור המחשב "${machineName}" בתאריך ${selectedDay}.`, container);
        }
    } catch (error) {
        console.error("שגיאה בעת חיפוש נתונים:", error);
        await showMessage("⚠️ אירעה תקלה בעת השליפה. אנא נסה שוב מאוחר יותר.", container);
    }
}

// יצירת תפריט שעות
function createHourMenu(container, machineName, selectedDay, hours) {
    const menuhour = document.createElement("div");
    menuhour.classList.add("menu-erea", "menu-hour");

    hours.forEach(hour => {
        const button = document.createElement("button");
        button.textContent = hour;
        button.classList.add("menu-button");
        button.onclick = () => fetchFile(container, machineName, selectedDay, hour);
        menuhour.appendChild(button);
    });

    container.appendChild(menuhour);
}

// פונקציה לחיפוש קבצים
async function fetchFile(container, machineName, selectedDay, selecteHour) {
    await showMessage(`⏳ מבצע חיפוש נתונים עבור "${machineName}" ביום "${selectedDay}" בשעה ${selecteHour}...`, container);

    try {
        const response = await fetch(`http://127.0.0.1:5000/get_file_list/${machineName}/${selectedDay}/${selecteHour}`);
        const data = await response.json();

        if (data && data.files.length > 0) {
            await showMessage(`🗂️ נתונים עבור המחשב "${machineName}" בתאריך ${selectedDay} בשעה ${selecteHour} נמצאו. מציג את הנתונים כעת...`, container);
            createFileMenu(container, machineName, selectedDay, selecteHour, data.files);
        } else {
            await showMessage(`❌ לא נמצאו נתונים עבור המחשב "${machineName}" בתאריך ${selectedDay} בשעה ${selecteHour}.`, container);
        }
    } catch (error) {
        console.error("שגיאה בעת חיפוש נתונים:", error);
        await showMessage("⚠️ אירעה תקלה בעת השליפה. אנא נסה שוב מאוחר יותר.", container);
    }
}

// יצירת תפריט קבצים
async function createFileMenu(container, machineName, selectedDay, selectedHour, files) {
    const menuFiles = document.createElement("div");
    menuFiles.classList.add("menu-erea", "menu-file");

    if (files && files.length > 0) {
        files.forEach(file => {
            const button = document.createElement("button");
            button.textContent = file;
            button.classList.add("menu-button");
            button.onclick = () => fetchFileData(container, machineName, selectedDay, selectedHour, file);
            menuFiles.appendChild(button);
        });
    } else {
        console.log("❌ אין קבצים להצגה");
    }
    container.appendChild(menuFiles);
}

// פונקציה לשליפת נתונים מקובץ
async function fetchFileData(container, machineName, selectedDay, selectedHour, selectedFile) {
    const url = `http://127.0.0.1:5000/get_file_data/${machineName}/${selectedDay}/${selectedFile}`;
    await showMessage(`📡 מבצע בקשה לכתובת: ${url}`, container);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`❌ שגיאה: קוד סטטוס ${response.status}`);
        }

        const data = await response.json();

        console.log("📡 raw data מהשרת:", data);  // ✅ בדיקה ראשונה - נתונים ישירות מהשרת
        
        if (data && data.content) {
            await showMessage(`🗂️ נתונים נמצאו עבור "${machineName}" בתאריך ${selectedDay} בשעה ${selectedHour}.`, container);
            const encryptedData = data.content;

            
            localStorage.setItem("encryptedData", encryptedData);
            window.location.href = "data.html";
        } else {
            await showMessage(`❌ לא נמצאו נתונים עבור "${machineName}" בתאריך ${selectedDay} בשעה ${selectedHour}.`, container);
        }
    } catch (error) {
        console.error("❌ שגיאה בטעינת נתוני קובץ:", error);
        await showMessage("⚠️ אירעה תקלה בעת טעינת הנתונים. אנא נסה שוב מאוחר יותר.", container);
    }
}



// אפקט הקלדה להודעות
function typeMessageEffect(message, container) {
    const messageElement = document.createElement('p');
    messageElement.classList.add('message');
    container.appendChild(messageElement);

    let i = 0;
    function typeCharacter() {
        if (i < message.length) {
            messageElement.textContent = message.slice(0, i + 1);
            i++;
            setTimeout(typeCharacter, 50);
        }
    }
    typeCharacter();
}

// אתחול הדף בעת טעינה
document.addEventListener('DOMContentLoaded', async function() {
    const username = localStorage.getItem('username');
    const usernameDiv = document.getElementById('username');
    usernameDiv.textContent = `🔒${username}`;
    
    const loginMessage = document.querySelector('.login-message');
    const messageContainer = document.getElementById('message-container');

    startClock();
    toggleElements([usernameDiv, messageContainer], 'none');
    toggleElements([loginMessage], 'block');

    await wait(3000);
    toggleElements([loginMessage], 'none');
    toggleElements([messageContainer], 'block');

    await showMessage(`ברוך הבא ${username}!`, messageContainer);
    await wait(1000);
    await fetchMachines(messageContainer);
});
