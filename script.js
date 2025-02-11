document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('content').style.display = 'block';
    }, 1500); // Simulierte Ladezeit

    checkBudget(); // Prüft, ob Budget vorhanden ist
    loadTheme(); // Lädt das gespeicherte Design

    // Startknopf für Budget-Setup
    document.getElementById('startButton').addEventListener('click', () => {
        document.getElementById('intro').style.display = 'none';
        document.getElementById('budgetSettings').style.display = 'block';
    });

    // Budget speichern
    document.getElementById('budgetForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const currency = document.getElementById('currency').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const interval = document.getElementById('interval').value;

        if (!isNaN(amount) && amount > 0) {
            saveBudget(currency, amount, interval);
            document.getElementById('budgetSettings').style.display = 'none';
            document.getElementById('expenseWindow').style.display = 'block';
            displayBudget();
        } else {
            alert("Bitte geben Sie einen gültigen Betrag ein.");
        }
    });

    // Ausgaben speichern
    document.getElementById('expenseForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const expenseAmount = parseFloat(document.getElementById('expenseAmount').value);
        const expenseReason = document.getElementById('expenseReason').value;
        const expenseDate = document.getElementById('expenseDate').value;

        if (!isNaN(expenseAmount) && expenseAmount > 0) {
            saveExpense(expenseAmount, expenseReason, expenseDate);
            displayExpenses();
            updateBudgetDisplay();
        } else {
            alert("Die Ausgabe darf nicht negativ sein.");
        }
    });

    // Darkmode-Switch
    document.getElementById('themeToggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });

    // Reset-Button
    document.getElementById('resetButton').addEventListener('click', () => {
        resetAll();
    });
});

// **Speichert und lädt das Budget**
function saveBudget(currency, amount, interval) {
    localStorage.setItem('budgetCurrency', currency);
    localStorage.setItem('budgetAmount', amount);
    localStorage.setItem('budgetInterval', interval);
}

function saveExpense(amount, reason, date) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push({ amount, reason, date });
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// **Budget anzeigen**
function displayBudget() {
    const currency = localStorage.getItem('budgetCurrency');
    const amount = parseFloat(localStorage.getItem('budgetAmount'));
    const remaining = amount - getTotalExpenses();
    const budgetDisplay = document.getElementById('budgetDisplay');

    budgetDisplay.textContent = `${currency} ${remaining.toFixed(2)} verbleibend`;

    // **Budget-Farben ändern**
    budgetDisplay.className = ''; 
    if (remaining > amount * 0.5) {
        budgetDisplay.classList.add('green');
    } else if (remaining > amount * 0.1) {
        budgetDisplay.classList.add('yellow');
    } else {
        budgetDisplay.classList.add('red');
    }
}

// **Darkmode speichern**
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

// **Reset-Funktion**
function resetAll() {
    if (confirm('Möchten Sie wirklich alle Daten zurücksetzen?')) {
        localStorage.clear();
        window.location.reload();
    }
}
