function getEncryptedDataFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const encryptedData = urlParams.get('encryptedData');
    console.log("נתוני URL שהתקבלו:", encryptedData);
    return encryptedData;
}

function decryptCycle(dataBytes, binaryKey) {
    let decryptedBytes = new Uint8Array(dataBytes.length);
    for (let i = 0; i < dataBytes.length; i++) {
        decryptedBytes[i] = dataBytes[i] ^ binaryKey[i % binaryKey.length];
    }
    return decryptedBytes;
}

function decryptAndShow() {
    const encryptedInput = getEncryptedDataFromUrl();
    const keyFile = document.getElementById("keyFile").files[0];

    if (!encryptedInput) {
        console.error("שגיאה: לא נמצא טקסט מוצפן ב-URL.");
        alert("לא נמצא טקסט מוצפן ב-URL.");
        return;
    }

    if (!keyFile) {
        console.error("שגיאה: לא הועלה קובץ מפתח בינארי.");
        alert("אנא העלה קובץ מפתח בינארי.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const binaryKey = new Uint8Array(e.target.result);
        console.log("המפתח הבינארי נטען בהצלחה:", binaryKey);
        const encryptedParts = encryptedInput.split(/(?=i\+ro)/g);
        console.log("הטקסט פוצל לחלקים הבאים:", encryptedParts);
        
        const decoder = new TextDecoder();
        let unifiedJSON = {};

        encryptedParts.forEach((part, index) => {
            try {
                let cleanedPart = part.trim().replace(/=+$/, '');
                console.log(`חלק ${index + 1} לפני פענוח (base64):`, cleanedPart);

                const encryptedBytes = Uint8Array.from(atob(cleanedPart), c => c.charCodeAt(0));
                const decryptedBytes = decryptCycle(encryptedBytes, binaryKey);
                const decryptedText = decoder.decode(decryptedBytes);

                console.log(`חלק ${index + 1} אחרי פענוח:`, decryptedText);

                const jsonObj = JSON.parse(decryptedText);
                unifiedJSON = {...unifiedJSON, ...jsonObj};
            } catch (error) {
                console.error(`שגיאה בפענוח או עיבוד JSON בחלק ${index + 1}:`, error.message);
                alert(`שגיאה בפענוח או עיבוד JSON בחלק ${index + 1}: ${error.message}`);
            }
        });

        displayTable(unifiedJSON);
    };

    reader.onerror = function() {
        console.error("שגיאה בקריאת קובץ המפתח:", reader.error);
        alert("אירעה שגיאה בקריאת הקובץ.");
    };

    reader.readAsArrayBuffer(keyFile);
}

function displayTable(jsonData) {
    console.log("הנתונים לאחר איחוד ל-JSON אחד:", jsonData);
    let tableHTML = '<table><tr><th>שעה</th><th>יישום</th><th>תוכן</th></tr>';

    for (const [time, apps] of Object.entries(jsonData)) {
        const appEntries = Object.entries(apps);
        const rowspan = appEntries.length;
        appEntries.forEach(([app, content], index) => {
            tableHTML += '<tr>';
            if (index === 0) {
                tableHTML += `<td rowspan="${rowspan}">${time}</td>`;
            }
            tableHTML += `<td>${app}</td><td>${content}</td></tr>`;
        });
    }

    tableHTML += '</table>';
    document.getElementById("output").innerHTML = tableHTML;
}
