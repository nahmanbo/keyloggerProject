// עדכון השעון
function updateClock() {
    const clock = document.getElementById("clock");
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    clock.textContent = `${hours}:${minutes}:${seconds}`;
}

document.addEventListener('DOMContentLoaded', function() {
    const loginMessage = document.querySelector('.login-message');
    const backgroundVideo = document.getElementById('background-video');
    const usernameDiv = document.getElementById('username');
    const clock = document.getElementById('clock');
    const buttons = document.getElementById('buttons-container');
    const messageContainer = document.getElementById('message-container');

    startClock();

    hideElements([usernameDiv, clock, buttons, messageContainer]);

    // קביעת שם המשתמש
    const username = localStorage.getItem('username');
    usernameDiv.textContent = `🔒${username}`;

    // הצגת אלמנטים לאחר חמש שניות
    setTimeout(() => {
        showLoginScreen([backgroundVideo, clock, usernameDiv, messageContainer]);
        hideElements([loginMessage]); // הסתרת הודעת הכניסה אחרי 5 שניות
    }, 5000);

    // הצגת הודעות ותחילת תהליך בקשת נתונים מהשרת
    setTimeout(() => displayMessages(username, messageContainer), 5000);
});

function hideElements(elements) {
    elements.forEach(element => element.style.display = 'none');
}

function showLoginScreen(elements) {
    elements.forEach(element => element.style.display = 'block');
}

// פונקציה אסינכרונית להצגת הודעות
async function displayMessages(username, container) {
    await showMessage(`ברוך הבא, ${username}!`, container);
    await wait(2000);  // המתן 2 שניות לפני ההודעה הבאה
    await showMessage("מחברים אותך לשרת... חכה שנייה, אנחנו כמעט שם!", container);
    await wait(2000);  // המתן 2 שניות לפני הפנייה לשרת
    await fetchMachineNamesFromServer(container);
}

async function showMessage(message, container) {
    return new Promise(resolve => {
        typeMessageEffect(message, container);
        setTimeout(resolve, message.length * 50); // זמן המתנה שווה לאורך ההודעה
    });
}

// פונקציית המתנה
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// בקשת נתונים מהשרת
async function fetchMachineNamesFromServer(container) {
    try {
        const response = await fetch('http://127.0.0.1:5000/get_machine_name');
        const data = await response.json();

        await wait(2000); // המתן 2 שניות לפני הצגת הודעה
        await showMessage("החיבור לשרת בוצע בהצלחה.", container);

        if (data.names && data.names.length > 0) {
            await wait(4000); // המתן 4 שניות לפני הצגת הודעה
            await showMessage("נמצאו מחשבים נגועים. הנתונים יוצגו כעת.", container);
            createButtons(data.names, container);
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
async function fetchDataFromServer(container, machine_names)
{
    try {
        const response = await fetch('http://127.0.0.1:5000/get_by_name/' + machine_names);
        const data = await response.json();

        await wait(2000); // המתן 2 שניות לפני הצגת הודעה
        await showMessage("החיבור לשרת בוצע בהצלחה.", container);

        if (data.names && data.names.length > 0) {
            await wait(4000); // המתן 4 שניות לפני הצגת הודעה
            await showMessage("נמצאו מחשבים נגועים. הנתונים יוצגו כעת.", container);
            createButtons(data.names, container);
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

function createButtons(buttonNames, container) {
    // יצירת קונטיינר לכפתורים
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("button-container");

    buttonNames.forEach(name => {
        const button = document.createElement("button");
        button.textContent = name;
        button.classList.add("custom-button");
        button.onclick = function() { 
            fetchDataFromServer(container, `${name}`);
        };

        buttonsContainer.appendChild(button);
    });

    container.appendChild(buttonsContainer);
}

function typeMessageEffect(message, container) {
    let messageElement = document.createElement('p');
    messageElement.classList.add('message');
    container.appendChild(messageElement);

    let cursor = document.createElement('span');
    cursor.classList.add('cursor');
    cursor.textContent = '|'; // הקו המהבהב
    messageElement.appendChild(cursor);

    let i = 0;
    function typeCharacter() {
        if (i < message.length) {
            messageElement.textContent = message.slice(0, i + 1); // מציג את הטקסט בהדרגה
            i++;
            setTimeout(typeCharacter, 50);
        } else {
            // הצגת הקו המהבהב אחרי שההקלדה הסתיימה
            cursor.style.visibility = "visible";
        }
    }
    typeCharacter(); // התחלת הכתיבה
}




// התחלת שעון עדכון כל שניה
function startClock() {
    updateClock();
    setInterval(updateClock, 1000);
}
