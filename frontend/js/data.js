// פונקציה לקריאת הנתונים מה-URL
function getEncryptedDataFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('encryptedData');
}

// קריאה בעת טעינת העמוד
document.addEventListener("DOMContentLoaded", function () {
    const encryptedText = getEncryptedDataFromUrl();
    
    if (encryptedText) {
        console.log("🔒 נתונים מוצפנים שהתקבלו:", encryptedText);
        
        // לחצן לפענוח
        document.getElementById("decryptButton").addEventListener("click", function () {
            const keyFile = document.getElementById("keyInput").files[0];

            if (keyFile) {
                decryptFile(keyFile, encryptedText).then(decryptedJson => {
                    console.log("📜 נתונים מפוענחים:", decryptedJson);
                    displayDataAsTable(decryptedJson);
                }).catch(error => {
                    console.error(error);
                    alert(error);
                });
            } else {
                alert("יש לבחור קובץ מפתח.");
            }
        });
    } else {
        alert("❌ לא נמצאו נתונים מוצפנים ב-URL.");
    }
});

// עדכון הפונקציה `decryptFile` לקבלת הנתונים מה-URL

async function decryptFile(keyFile, encryptedText) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const key = new Uint8Array(event.target.result);

            // חיפוש כל המחרוזות שמתחילות ב-"i+ro2X"
            const encryptedParts = encryptedText.match(/i\+ro2X[A-Za-z0-9+/=]+/g);

            if (!encryptedParts || encryptedParts.length === 0) {
                return reject("❌ שגיאה: לא נמצאו נתונים מוצפנים.");
            }

            try {
                const mergedData = encryptedParts.reduce((acc, part) => {
                    const decryptedData = xorDecrypt(atob(part), key);
                    const jsonData = JSON.parse(decryptedData);
                    return mergeJsonObjects(acc, jsonData);
                }, {});

                resolve(mergedData);
            } catch (error) {
                reject("❌ שגיאה בפענוח הנתונים: " + error);
            }
        };
        reader.onerror = () => reject("❌ שגיאה בקריאת קובץ המפתח.");
        reader.readAsArrayBuffer(keyFile);
    });
}

function xorDecrypt(encryptedData, key) {
    const decrypted = [];
    for (let i = 0; i < encryptedData.length; i++) {
        decrypted.push(encryptedData.charCodeAt(i) ^ key[i % key.length]); // XOR מחזורי עם המפתח
    }
    try {
        return decodeURIComponent(escape(String.fromCharCode(...decrypted))); // טיפול נכון בעברית
    } catch {
        return new TextDecoder('utf-8').decode(new Uint8Array(decrypted)); // fallback אם יש בעיה
    }
}

function mergeJsonObjects(obj1, obj2) {
    const merged = { ...obj1 };

    Object.entries(obj2).forEach(([date, programs]) => {
        if (!merged[date]) {
            merged[date] = { ...programs };
        } else {
            Object.entries(programs).forEach(([program, value]) => {
                merged[date][program] = value;
            });
        }
    });

    return merged;
}

function displayDataAsTable(data) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    if (!data || typeof data !== "object") {
        resultDiv.innerHTML = "<p style='color: red;'>שגיאה: הנתונים אינם בפורמט JSON תקין.</p>";
        return;
    }

    const table = document.createElement("table");

    // יצירת כותרת הטבלה
    const headerRow = document.createElement("tr");
    ["תאריך ושעה", "תוכנה", "נתונים"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // יצירת שורות הנתונים
    Object.entries(data).forEach(([date, programs]) => {
        const programEntries = Object.entries(programs);
        programEntries.forEach(([program, value], index) => {
            const row = document.createElement("tr");

            if (index === 0) {
                const tdDate = document.createElement("td");
                tdDate.textContent = date;
                tdDate.rowSpan = programEntries.length;
                row.appendChild(tdDate);
            }

            const tdProgram = document.createElement("td");
            tdProgram.textContent = program;
            row.appendChild(tdProgram);

            const tdValue = document.createElement("td");
            tdValue.textContent = value;
            row.appendChild(tdValue);

            table.appendChild(row);
        });
    });

    resultDiv.appendChild(table);

    // יצירת קובץ JSON להורדה
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "decrypted_data.json";
    link.textContent = "⬇ לחץ כאן להורדת JSON";
    link.id = "downloadLink";
    resultDiv.appendChild(link);
}
