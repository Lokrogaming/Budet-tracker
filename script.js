document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('content').style.display = 'block';
    }, 1500); // Simulierte Ladezeit

    // Wenn das Budget bereits gesetzt wurde, den Bereich anzeigen
    checkBudget();
    
    // EventListener für das Starten des Budgeteinrichtungsformulars
    document.getElementById('startButton').addEventListener('click', () => {
        document.getElementById('intro').style.display = 'none';
        document.getElementById('budgetSettings').style.display = 'block';
    });

    // Formular für Budget speichern
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

    // Formular für Ausgaben speichern
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

    // EventListener für den Graphen-Button
    document.getElementById('toggleGraphBtn').addEventListener('click', () => {
        const chartContainer = document.getElementById('chartContainer');
        chartContainer.style.display = chartContainer.style.display === 'none' ? 'block' : 'none';
        createGraph();
    });

    // EventListener für den Reset-Button
    document.getElementById('resetButton').addEventListener('click', () => {
        resetAll();
    });
});

// Budget und Ausgaben im localStorage speichern
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

// Budget anzeigen
function displayBudget() {
    const currency = localStorage.getItem('budgetCurrency');
    const amount = parseFloat(localStorage.getItem('budgetAmount'));
    const interval = localStorage.getItem('budgetInterval');
    const budgetDisplay = document.getElementById('budgetDisplay');

    budgetDisplay.textContent = `${currency} ${amount.toFixed(2)} (${interval})`;

    // Berechnung der verbleibenden Budget und Farben ändern
    const remaining = amount - getTotalExpenses();
    if (remaining > amount * 0.5) {
        budgetDisplay.classList.add('green');
    } else if (remaining > amount * 0.1) {
        budgetDisplay.classList.add('yellow');
    } else {
        budgetDisplay.classList.add('red');
    }
}

// Ausgaben anzeigen
function displayExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expenseList = document.getElementById('expenseWindow');
    const expenseListContainer = document.createElement('ul');
    
    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.textContent = `${expense.date} - ${expense.reason}: ${expense.amount.toFixed(2)} ${localStorage.getItem('budgetCurrency')}`;
        expenseListContainer.appendChild(li);
    });

    expenseList.appendChild(expenseListContainer);
}

// Verbleibendes Budget aktualisieren
function updateBudgetDisplay() {
    const amount = parseFloat(localStorage.getItem('budgetAmount'));
    const remaining = amount - getTotalExpenses();
    const budgetDisplay = document.getElementById('budgetDisplay');
    budgetDisplay.textContent = `${localStorage.getItem('budgetCurrency')} ${remaining.toFixed(2)} verbleibend`;

    if (remaining > amount * 0.5) {
        budgetDisplay.classList.remove('yellow', 'red');
        budgetDisplay.classList.add('green');
    } else if (remaining > amount * 0.1) {
        budgetDisplay.classList.remove('green', 'red');
        budgetDisplay.classList.add('yellow');
    } else {
        budgetDisplay.classList.remove('green', 'yellow');
        budgetDisplay.classList.add('red');
    }
}

// Berechnung der gesamten Ausgaben
function getTotalExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    return expenses.reduce((total, expense) => total + expense.amount, 0);
}

// Budget prüfen, wenn die Seite geladen wird
function checkBudget() {
    const currency = localStorage.getItem('budgetCurrency');
    if (currency) {
        displayBudget();
        document.getElementById('expenseWindow').style.display = 'block';
    }
}

// Graphen für Ausgaben anzeigen
function createGraph() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const labels = expenses.map(expense => expense.date);
    const data = expenses.map(expense => expense.amount);

    const ctx = document.getElementById('expenseChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ausgaben',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        }
    });
}

// Reset alle Daten zurücksetzen
function resetAll() {
    if (confirm('Möchten Sie wirklich alle Daten zurücksetzen?')) {
        localStorage.removeItem('budgetCurrency');
        localStorage.removeItem('budgetAmount');
        localStorage.removeItem('budgetInterval');
        localStorage.removeItem('expenses');
        
        // Seite neu laden, um alles zu resetten
        window.location.reload();
    }
}
