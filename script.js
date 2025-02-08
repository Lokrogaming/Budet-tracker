// Beim Laden der Seite gespeicherte Einstellungen abrufen
window.onload = function() {
    let settings = JSON.parse(localStorage.getItem("budgetSettings"));
    if (settings) {
        document.getElementById("currency").value = settings.currency;
        document.getElementById("budget").value = settings.budget;

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

    if (!budget || budget <= 0) {
        alert("Bitte ein gültiges Budget eingeben!");
        return;
    }

    const settings = {
        currency: currency,
        budget: parseFloat(budget),
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
    } catch (error) {
        alert("Fehler beim Speichern: " + error.message);  // Fehlerbehandlung
    }
}

// Funktion zum Anzeigen der Erfolgsmeldung
function showSuccessMessage() {
    const message = document.createElement('div');
    message.textContent = "Einstellungen erfolgreich gespeichert!";
    message.classList.add("savedMessage");
    document.body.appendChild(message);

    // Zeige Nachricht für eine Sekunde und entferne sie dann
    setTimeout(() => {
        message.style.display = 'block';
        setTimeout(() => {
            message.style.display = 'none';
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
