document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('content').style.display = 'block';
    }, 1500);

    checkBudget();
    loadTheme();

    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.addEventListener('click', () => {
            document.getElementById('intro').style.display = 'none';
            document.getElementById('budgetSettings').style.display = 'block';
        });
    } else {
        console.error("Fehler: 'startButton' nicht gefunden.");
    }

    const budgetForm = document.getElementById('budgetForm');
    if (budgetForm) {
        budgetForm.addEventListener('submit', (e) => {
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
    }

    document.getElementById('themeToggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    document.getElementById('resetButton').addEventListener('click', () => {
        resetAll();
    });
});

function checkBudget() {
    const budgetAmount = localStorage.getItem('budgetAmount');
    if (budgetAmount) {
        document.getElementById('budgetSettings').style.display = 'none';
        document.getElementById('expenseWindow').style.display = 'block';
        displayBudget();
    }
}

function saveBudget(currency, amount, interval) {
    localStorage.setItem('budgetCurrency', currency);
    localStorage.setItem('budgetAmount', amount);
    localStorage.setItem('budgetInterval', interval);
}

function displayBudget() {
    const currency = localStorage.getItem('budgetCurrency');
    const amount = parseFloat(localStorage.getItem('budgetAmount'));
    const remaining = amount - getTotalExpenses();
    const budgetDisplay = document.getElementById('budgetDisplay');

    budgetDisplay.textContent = `${currency} ${remaining.toFixed(2)} verbleibend`;

    budgetDisplay.className = ''; 
    if (remaining > amount * 0.5) {
        budgetDisplay.classList.add('green');
    } else if (remaining > amount * 0.1) {
        budgetDisplay.classList.add('yellow');
    } else {
        budgetDisplay.classList.add('red');
    }
}

function getTotalExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

function resetAll() {
    if (confirm('Möchten Sie wirklich alle Daten zurücksetzen?')) {
        localStorage.clear();
        window.location.reload();
    }
}
