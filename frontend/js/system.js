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

document.addEventListener("DOMContentLoaded", function() {
    const fileInput = document.getElementById("file-upload");
    const fileLabel = document.getElementById("file-label");
    const uploadButton = document.getElementById("upload-button");
    const uploadMessage = document.getElementById("upload-message");

    // עדכון שם הקובץ שנבחר
    fileInput.addEventListener("change", function() {
        if (fileInput.files.length > 0) {
            fileLabel.textContent = `📂 ${fileInput.files[0].name}`;
        } else {
            fileLabel.textContent = "בחר קובץ .bin";
        }
    });

    // כפתור העלאת הקובץ
    uploadButton.addEventListener("click", function() {
        if (!fileInput.files.length) {
            uploadMessage.textContent = "❌ אנא בחר קובץ .bin להעלאה.";
            uploadMessage.style.color = "red";
            return;
        }

        const file = fileInput.files[0];

        if (!file.name.endsWith(".bin")) {
            uploadMessage.textContent = "❌ רק קבצים עם סיומת .bin נתמכים!";
            uploadMessage.style.color = "red";
            return;
        }

        uploadMessage.textContent = `✅ הקובץ "${file.name}" נטען בהצלחה!`;
        uploadMessage.style.color = "green";

        // מחיקת האלמנטים של ההעלאה בלבד אחרי 2 שניות
        setTimeout(() => {
            fileLabel.style.display = "none";
            uploadButton.style.display = "none";
            fileInput.style.display = "none";
            uploadMessage.style.display = "none";
        }, 2000);
    });
});


async function decryptDataToFile(encryptedString, keyFile, outputFileName = "decrypted_data.json") {
    try {
        // קריאת המפתח מהקובץ
        const keyResponse = await fetch(keyFile);
        const keyArrayBuffer = await keyResponse.arrayBuffer();
        const key = new Uint8Array(keyArrayBuffer);

        // פיצול הנתונים לפי שורות (כל דקה)
        const encryptedLines = encryptedString.split("\n");
        const decryptedData = {};

        encryptedLines.forEach((line, index) => {
            if (line.trim() === "") return;

            // המרת מחרוזת מוצפנת מבסיס 64 לבייטים
            const encryptedBytes = Uint8Array.from(atob(line), c => c.charCodeAt(0));

            // ביצוע XOR עם המפתח המחזורי
            const decryptedBytes = encryptedBytes.map((byte, i) => byte ^ key[i % key.length]);

            // המרת הבייטים חזרה למחרוזת JSON
            const jsonString = new TextDecoder().decode(decryptedBytes);

            try {
                // המרת JSON לאובייקט ושמירתו במילון
                decryptedData[`minute_${index + 1}`] = JSON.parse(jsonString);
            } catch (e) {
                console.error("Failed to parse JSON:", e);
            }
        });

        // המרת האובייקט למחרוזת JSON
        const jsonData = JSON.stringify(decryptedData, null, 2);

        // יצירת קובץ JSON להורדה
        const blob = new Blob([jsonData], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = outputFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        console.log("Decrypted data saved as:", outputFileName);
    } catch (error) {
        console.error("Decryption failed:", error);
    }
}


