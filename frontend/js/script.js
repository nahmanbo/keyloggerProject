const users = {
    "nahmanbo": "nahman2003",
    "mordechai": "ai1234",
    "chagai_t": "the_king"
};

function showError(message) {
    const errorElement = document.getElementById("error-message");
    errorElement.textContent = message;
    errorElement.style.display = "block"; 
}

function updateClock() {
    const clock = document.getElementById("clock");
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    clock.textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
updateClock();

document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); 

        const username = form.querySelector("input[type='text']").value;
        const password = form.querySelector("input[type='password']").value;

        if (!username || !password) {
            showError("אנא מלא את כל השדות");
            return;
        }

        if (users[username] && users[username] === password) {
            localStorage.setItem("username", username); 
            window.location.href = "dashboard.html";
        } else {
            showError("שם משתמש או סיסמה שגויים");
        }
    });
});
