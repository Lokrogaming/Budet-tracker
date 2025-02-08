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

// Berechnet, wie viele Tage seit dem letzten Besuch vergangen sind
function calculateDaysPassed(lastVisitDate) {
    const currentDate = new Date();
    const timeDiff = currentDate - lastVisitDate;
    return Math.floor(timeDiff / (1000 * 3600 * 24)); // in Tagen
}

// Budget je nach Zyklus (täglich, wöchentlich, monatlich, jährlich) anpassen
function updateBudget(settings, daysPassed) {
    if (!settings || !settings.budget) return;

    let cycle = document.getElementById("cycle").value;
    let dailyBudget = settings.budget;
    let updatedBudget = settings.remaining;

    switch (cycle) {
        case "daily":
            updatedBudget += dailyBudget * daysPassed;
            break;
        case "weekly":
            updatedBudget += dailyBudget * 7 * daysPassed;
            break;
        case "monthly":
            updatedBudget += dailyBudget * 30 * daysPassed;
            break;
        case "yearly":
            updatedBudget += dailyBudget * 365 * daysPassed;
            break;
    }

    settings.remaining = updatedBudget;
    localStorage.setItem("budgetSettings", JSON.stringify(settings));
}

// Funktion zur Eingabe einer Ausgabe
function addExpense() {
    const amount = parseFloat(prompt("Betrag der Ausgabe eingeben:"));
    if (!amount || amount <= 0) {
        alert("Ungültige Eingabe!");
        return;
    }

    let settings = JSON.parse(localStorage.getItem("budgetSettings"));
    if (!settings) {
        alert("Bitte zuerst ein Budget festlegen!");
        return;
    }

    settings.remaining -= amount;
    localStorage.setItem("budgetSettings", JSON.stringify(settings));

    // Warnungen anzeigen
    checkBudgetWarnings(settings.remaining, settings.budget);
}

// Funktion zur Prüfung der Budget-Warnungen
function checkBudgetWarnings(remaining, budget) {
    const onePercent = budget * 0.01;
    
    if (remaining <= 0) {
        sendNotification("⚠️ Budget aufgebraucht!");
    } else if (remaining <= onePercent) {
        sendNotification("⚠️ Nur noch 1 % deines Budgets übrig!");
    }
}

// Speichern des aktuellen Datums, wenn die Seite verlassen wird
window.onbeforeunload = function() {
    localStorage.setItem("lastVisitDate", new Date());
};

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

    localStorage.setItem("budgetSettings", JSON.stringify(settings));
    localStorage.setItem("lastVisitDate", new Date());  // Speichert das Datum des letzten Besuchs
    alert("Einstellungen gespeichert!");
    console.log("Einstellungen gespeichert: ", settings);
}

// Überprüfen, ob der Knopf zum Speichern korrekt funktioniert
document.getElementById("saveButton").addEventListener("click", function() {
    console.log("Speichern-Knopf gedrückt!");
    saveSettings();
});
