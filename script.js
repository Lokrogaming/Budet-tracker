// Initialisieren des Diagramms und der Ausgaben
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

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

    // Anzeigen des Analysefensters
    displayAnalysisWindow();
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

// EventListener für den "Ausgabe hinzufügen"-Button
document.getElementById("addExpenseButton").addEventListener("click", function() {
    document.getElementById("expenseFormContainer").classList.remove("hidden");
});

// EventListener für den "Ausgabe hinzufügen"-Button im Formular
document.getElementById("submitExpenseButton").addEventListener("click", function() {
    let expenseAmount = parseFloat(document.getElementById("expenseAmount").value);
    let expenseReason = document.getElementById("expenseReason").value;
    let expenseDate = document.getElementById("expenseDate").value;

    if (expenseAmount <= 0 || !expenseReason || !expenseDate) {
        alert("Bitte gib einen gültigen Betrag, Grund und Datum ein.");
        return;
    }

    let expense = {
        amount: expenseAmount,
        reason: expenseReason,
        date: expenseDate
    };

    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    // Aktuelles Budget aktualisieren
    let settings = JSON.parse(localStorage.getItem("budgetSettings"));
    settings.remaining -= expenseAmount;

    if (settings.remaining < 0) {
        settings.remaining = 0;
    }

    localStorage.setItem("budgetSettings", JSON.stringify(settings));
    updateBudgetDisplay(settings);
    document.getElementById("expenseFormContainer").classList.add("hidden");  // Formular ausblenden
    displayAnalysisWindow();  // Analysefenster aktualisieren
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
    } catch (error) {
        alert("Fehler beim Speichern: " + error.message);
    }
}

function calculateDaysPassed(lastVisitDate) {
    const currentDate = new Date();
    const timeDifference = currentDate - lastVisitDate;
    return Math.floor(timeDifference / (1000 * 3600 * 24));
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

// Funktion zur Anzeige des Analysefensters
function displayAnalysisWindow() {
    const expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = '';

    expenses.forEach(expense => {
        let listItem = document.createElement("li");
        listItem.textContent = `${expense.date} - ${expense.reason}: ${expense.amount}€`;
        expenseList.appendChild(listItem);
    });

    const ctx = document.getElementById("expenseChart").getContext("2d");
    const labels = expenses.map(expense => expense.date);
    const amounts = expenses.map(expense => expense.amount);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ausgaben',
                data: amounts,
                borderColor: 'rgb(75, 192, 192)',
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    document.getElementById("analysisWindow").classList.remove("hidden");
}
