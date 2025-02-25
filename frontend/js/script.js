const users = {
    "nahmanbo": "nahman2003",
    "mordechai": "ai1234",
    "chagai_t": "the_king"
};

// הצגת הודעת שגיאה
function showError(message) {
    const errorElement = document.getElementById("error-message");
    errorElement.textContent = message;
    errorElement.style.display = "block";
}

// עדכון השעון
function updateClock() {
    const clock = document.getElementById("clock");
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    clock.textContent = `${hours}:${minutes}:${seconds}`;
}

// מאזין לאירועים בטעינת הדף
document.addEventListener("DOMContentLoaded", function() {
    initializeForm();
    startClock();
});

// אתחול הפונקציות
function initializeForm() {
    const form = document.querySelector("form");
    const usernameInput = form.querySelector("input[type='text']");
    const passwordInput = form.querySelector("input[type='password']");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // מונע שליחה אוטומטית

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        handleFormSubmit(username, password);
    });
}

// טיפול בשליחת הטופס
function handleFormSubmit(username, password) {
    // ניקוי הודעות שגיאה ישנות
    hideErrorMessage();

    // בדוק אם השדות ריקים
    if (!username || !password) {
        showError("אנא מלא את כל השדות");
        return;
    }

    // בדוק אם שם המשתמש והסיסמה נכונים
    if (isValidUser(username, password)) {
        localStorage.setItem("username", username); // שמור את שם המשתמש
        window.location.href = "system.html"; // הפנה לדף המערכת
    } else {
        showError("שם משתמש או סיסמה שגויים");
    }
}

// בדוק אם המשתמש קיים
function isValidUser(username, password) {
    return users[username] && users[username] === password;
}

// הסתרת הודעת שגיאה
function hideErrorMessage() {
    const errorElement = document.getElementById("error-message");
    errorElement.style.display = "none";
}

// התחלת שעון עדכון כל שניה
function startClock() {
    updateClock();
    setInterval(updateClock, 1000);
}
