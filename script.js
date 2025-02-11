document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('content').style.display = 'block';
    }, 1500);

    checkBudget();
    loadTheme();
    displayExpenses(); // Liste der Ausgaben beim Start anzeigen

    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.addEventListener('click', () => {
            document.getElementById('intro').style.display = 'none';
            document.getElementById('budgetSettings').style.display = 'block';
        });
    }

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

    document.getElementById('expenseForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        const reason = document.getElementById('expenseReason').value;
        const date = document.getElementById('expenseDate').value;

        if (!isNaN(amount) && amount > 0) {
            saveExpense(amount, reason, date);
            displayExpenses();
            updateBudgetDisplay();
        } else {
            alert("Die Ausgabe darf nicht negativ sein.");
        }
    });

    document.getElementById('themeToggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    document.getElementById('resetButton').addEventListener('click', () => {
        resetAll();
    });
});

function displayExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expenseList = document.getElementById('expenseList'); 

    if (!expenseList) return;

    expenseList.innerHTML = "";

    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.textContent = `${expense.date} - ${expense.reason}: ${expense.amount.toFixed(2)} ${localStorage.getItem('budgetCurrency')}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "❌";
        deleteButton.onclick = () => removeExpense(index);
        
        li.appendChild(deleteButton);
        expenseList.appendChild(li);
    });
}

function removeExpense(index) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
}

function saveBudget(currency, amount, interval) {
    localStorage.setItem('budgetCurrency', currency);
    localStorage.setItem('budgetAmount', amount);
    localStorage.setItem('budgetInterval', interval);
}

function checkBudget() {
    const budgetAmount = localStorage.getItem('budgetAmount');
    if (budgetAmount) {
        document.getElementById('budgetSettings').style.display = 'none';
        document.getElementById('expenseWindow').style.display = 'block';
        displayBudget();
    }
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
