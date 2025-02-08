// Beim Laden der Seite gespeicherte Einstellungen abrufen
window.onload = function() {
    let settings = JSON.parse(localStorage.getItem("budgetSettings"));
    if (settings) {
        document.getElementById("currency").value = settings.currency;
        document.getElementById("budget").value = settings.budget;
        document.getElementById("interval").value = settings.interval;

        // Berechnung der Zeitspanne seit dem letzten Besuch
        let lastVisitDate = new Date(localStorage.getItem("lastVisitDate"));
        if (lastVisitDate) {
            let daysPassed = calculateDaysPassed(lastVisitDate);
            updateBudget(settings, daysPassed);
        }
    }
};

// EventListener für den "Speichern"-Button
document.getElementById("saveButton").addEventListener("click", function() {
    saveSettings();  // Funktion zum Speichern der Einstellungen aufrufen
});

// Speichern der Einstellungen
function saveSettings() {
    const currency = document.getElementById("currency").value;
    const budget = document.getElementById("budget").value;
    const interval = document.getElementById("interval").value;

    if (!budget || budget <= 0) {
        alert("Bitte ein gültiges Budget eingeben!");
        return;
    }

    const settings = {
        currency: currency,
        budget: parseFloat(budget),
        interval: interval, // Das Intervall wird hier gespeichert
        remaining: parseFloat(budget) // Start = Budget
    };

    try {
        localStorage.setItem("budgetSettings", JSON.stringify(settings));  // Speichern der Einstellungen
        localStorage.setItem("lastVisitDate", new Date());  // Speichert das Datum des letzten Besuchs
        alert("Einstellungen gespeichert!");
        showSuccessMessage();  // Erfolgsnachricht anzeigen
        updateBudgetDisplay(settings); // Budget im Fortschrittsbalken anzeigen

        // Warnung bei 1% verbleibendem Budget
        if (settings.remaining <= settings.budget * 0.01) {
            showWarning("Achtung: Nur noch 1% deines Budgets übrig!");
        }

        // Warnung bei aufgebrauchtem Budget
        if (settings.remaining <= 0) {
            showWarning("Warnung: Dein Budget ist aufgebraucht!");
        }

        // Intervallverwaltung
        resetBudgetAtInterval(settings); // Intervall zurücksetzen
    } catch (error) {
        alert("Fehler beim Speichern: " + error.message);  // Fehlerbehandlung
    }
}

// Funktion zum Berechnen der vergangenen Tage
function calculateDaysPassed(lastVisitDate) {
    const currentDate = new Date();
    const timeDifference = currentDate - lastVisitDate;
    return Math.floor(timeDifference / (1000 * 3600 * 24)); // Umrechnen in Tage
}

// Intervallverwaltung - Budget zurücksetzen
function resetBudgetAtInterval(settings) {
    let currentDate = new Date();
    let lastVisitDate = new Date(localStorage.getItem("lastVisitDate"));
    let intervalInDays = getIntervalInDays(settings.interval);

    // Berechnen, ob das Budget zurückgesetzt werden soll
    let daysPassed = calculateDaysPassed(lastVisitDate);
    if (daysPassed >= intervalInDays) {
        settings.remaining = settings.budget; // Budget zurücksetzen
        localStorage.setItem("budgetSettings", JSON.stringify(settings)); // Speichern der neuen Einstellungen
        showSuccessMessage("Dein Budget wurde zurückgesetzt!");
    }
}

// Funktion, um das Intervall in Tagen zu berechnen
function getIntervalInDays(interval) {
    switch (interval) {
        case 'daily': return 1;
        case 'weekly': return 7;
        case 'monthly': return 30;
        case 'yearly': return 365;
        default: return 1;
    }
}

// Funktion zum Anzeigen der Erfolgsmeldung
function showSuccessMessage(message = "Einstellungen erfolgreich gespeichert!") {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add("savedMessage");
    document.body.appendChild(messageElement);

    // Zeige Nachricht für eine Sekunde und entferne sie dann
    setTimeout(() => {
        messageElement.style.display = 'block';
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 2000);
    }, 100);
}

// Funktion zum Anzeigen der Warnungen
function showWarning(message) {
    const warningMessage = document.createElement('div');
    warningMessage.textContent = message;
    warningMessage.classList.add("warningMessage");
    document.body.appendChild(warningMessage);

    // Zeige Warnung für 3 Sekunden und entferne sie dann
    setTimeout(() => {
        warningMessage.style.display = 'block';
        setTimeout(() => {
            warningMessage.style.display = 'none';
        }, 3000);
    }, 100);
}

// Funktion zum Aktualisieren der Budgetanzeige
function updateBudgetDisplay(settings) {
    const totalBudget = settings.budget;
    const remaining = settings.remaining;
    const progressBar = document.getElementById("progressBar");
    const remainingAmount = document.getElementById("remainingAmount");

    // Berechne den Fortschritt
    let progress = (remaining / totalBudget) * 100;
    progressBar.style.width = progress + "%"; // Setzt die Breite des Balkens

    // Zeige das verbleibende Budget an
    remainingAmount.textContent = remaining + "€";
}
