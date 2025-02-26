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

// ניקוי הודעת שגיאה
function clearErrorMessage() {
    document.getElementById("error-message").style.display = "none";
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

// הפעלת השעון
function startClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

// אתחול טופס התחברות
function setupLoginForm() {
    const form = document.querySelector("form");
    const usernameInput = form.querySelector("input[type='text']");
    const passwordInput = form.querySelector("input[type='password']");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // מונע שליחה אוטומטית
        processLogin(usernameInput.value.trim(), passwordInput.value.trim());
    });
}

// טיפול בשליחת טופס ההתחברות
function processLogin(username, password) {
    clearErrorMessage();

    if (!username || !password) {
        showError("אנא מלא את כל השדות");
        return;
    }

    if (authenticateUser(username, password)) {
        localStorage.setItem("username", username); // שמירת שם המשתמש
        window.location.href = "system.html"; // הפניה למערכת
    } else {
        showError("שם משתמש או סיסמה שגויים");
    }
}

// אימות משתמש
function authenticateUser(username, password) {
    return users[username] === password;
}

// טעינת פונקציות בעת פתיחת הדף
document.addEventListener("DOMContentLoaded", function() {
    setupLoginForm();
    startClock();
});
