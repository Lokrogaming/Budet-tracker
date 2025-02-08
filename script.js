// Beim Laden der Seite gespeicherte Einstellungen abrufen
window.onload = function() {
    let settings = JSON.parse(localStorage.getItem("budgetSettings"));
    if (settings) {
        document.getElementById("currency").value = settings.currency;
        document.getElementById("budget").value = settings.budget;
    }
};

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
