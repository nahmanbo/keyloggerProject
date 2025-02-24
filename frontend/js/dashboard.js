document.addEventListener("DOMContentLoaded", function() {
    const welcomeMessage = document.getElementById("welcome-message");
    const dashboardContent = document.getElementById("dashboard-content");
    const clock = document.getElementById("clock");
    const usernameDisplay = document.getElementById("username");

    // Fetch the username from localStorage (if set) or default to a placeholder
    const username = localStorage.getItem("username") || "לא מחובר"; // אם לא קיים, יציג "לא מחובר"

    // Show the loading message first
    welcomeMessage.textContent = "המערכת טוענת...";

    // Step 1: Show the "Loading..." message for 3 seconds
    setTimeout(function() {
        // Update the message to "Welcome {username}!"
        welcomeMessage.innerHTML = `ברוך הבא, ${username}!`;

        // Display the hidden content
        dashboardContent.classList.remove("hidden");

        // Display the username in the top right corner
        usernameDisplay.textContent = username;

        // Start the clock
        setInterval(updateClock, 1000);
        updateClock();
    }, 3000); // Wait for 3 seconds

    // Function to update the clock
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0");
        clock.textContent = `${hours}:${minutes}:${seconds}`;
    }

    // פונקציה שתטעין את הנתונים מהקובץ JSON
    function loadData() {
        fetch('data.json') // קריאה לקובץ ה-JSON
            .then(response => response.json())
            .then(data => {
                console.log("Data loaded:", data); // להדפיס את הנתונים לקונסול כדי לבדוק אם הם נטענים
                // מציאת הטבלה
                const tableBody = document.querySelector("#data-table tbody");
                // ריקון התוכן הקודם בטבלה
                tableBody.innerHTML = '';

                // הוספת כל שורה מהנתונים לטבלה
                data.forEach(item => {
                    const row = document.createElement('tr');
                    
                    const nameCell = document.createElement('td');
                    nameCell.textContent = item.name;
                    
                    const ageCell = document.createElement('td');
                    ageCell.textContent = item.age;
                    
                    const cityCell = document.createElement('td');
                    cityCell.textContent = item.city;
                    
                    row.appendChild(nameCell);
                    row.appendChild(ageCell);
                    row.appendChild(cityCell);
                    
                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error("שגיאה בטעינת הנתונים:", error);
            });
    }

    // פונקציה להסתיר את הודעת ברוך הבא ולהציג את התוכן
    function showDashboard() {
        const welcomeMessage = document.getElementById("welcome-message");
        welcomeMessage.textContent = ''; // מוחקים את הודעת ברוך הבא

        const dashboardContent = document.getElementById("dashboard-content");
        dashboardContent.classList.remove("hidden"); // מציגים את התוכן

        loadData(); // טוענים את הנתונים
    }

    // מחכים 3 שניות ואז מציגים את התוכן
    setTimeout(showDashboard, 3000);
});
