// Beim Laden der Seite gespeicherte Einstellungen abrufen
window.onload = function() {
    let settings = JSON.parse(localStorage.getItem("budgetSettings"));
    if (settings) {
        document.getElementById("currency").value = settings.currency;
        document.getElementById("budget").value = settings.budget;
        document.getElementById("interval").value = settings.interval;

        let lastVisitDate = new Date(localStorage.getItem("lastVisitDate"));
        if (lastVisitDate) {
            let daysPassed = calculateDaysPassed(lastVisitDate);
            updateBudget(settings, daysPassed);
        }
    }

    let savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('darkmode');
        document.getElementById('themeToggle').checked = true;
    }

    document.getElementById('themeToggle').addEventListener('change', toggleTheme);
};

// Umschalten zwischen Light und Dark Mode
function toggleTheme() {
    if (document.getElementById('themeToggle').checked) {
        document.body.classList.add('darkmode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('darkmode');
        localStorage.setItem('theme', 'light');
    }
}

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
        interval: interval,
        remaining: parseFloat(budget)
    };

    try {
        localStorage.setItem("budgetSettings", JSON.stringify(settings));
        localStorage.setItem("lastVisitDate", new Date());
        alert("Einstellungen gespeichert!");
        updateBudgetDisplay(settings);

        if (settings.remaining <= settings.budget * 0.01) {
            showWarning("Achtung: Nur noch 1% deines Budgets übrig!");
        }

        if (settings.remaining <= 0) {
            showWarning("Warnung: Dein Budget ist aufgebraucht!");
        }

        resetBudgetAtInterval(settings);
    } catch (error) {
        alert("Fehler beim Speichern: " + error.message);
    }
}

function calculateDaysPassed(lastVisitDate) {
    const currentDate = new Date();
    const timeDifference = currentDate - lastVisitDate;
    return Math.floor(timeDifference / (1000 * 3600 * 24));
}

function resetBudgetAtInterval(settings) {
    let intervalInDays = getIntervalInDays(settings.interval);
    let lastVisitDate = new Date(localStorage.getItem("lastVisitDate"));
    let daysPassed = calculateDaysPassed(lastVisitDate);

    if (daysPassed >= intervalInDays) {
        settings.remaining = settings.budget;
        localStorage.setItem("budgetSettings", JSON.stringify(settings));
        alert("Dein Budget wurde zurückgesetzt!");
    }
}

function getIntervalInDays(interval) {
    switch (interval) {
        case 'daily': return 1;
        case 'weekly': return 7;
        case 'monthly': return 30;
        case 'yearly': return 365;
        default: return 1;
    }
}

function updateBudgetDisplay(settings) {
    document.getElementById('remainingAmount').textContent = settings.remaining + "€";
    const percentageRemaining = settings.remaining / settings.budget * 100;
    updateProgressBar(percentageRemaining);
}

function updateProgressBar(percentage) {
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = percentage + "%";
    if (percentage > 50) {
        progressBar.style.backgroundColor = "green";
    } else if (percentage > 20) {
        progressBar.style.backgroundColor = "orange";
    } else {
        progressBar.style.backgroundColor = "red";
    }
}

function showWarning(message) {
    let warningMessage = document.createElement("div");
    warningMessage.classList.add("warningMessage");
    warningMessage.textContent = message;
    document.getElementById('budgetDashboard').appendChild(warningMessage);
}
