document.addEventListener('DOMContentLoaded', () => {
    checkBudget();
});

// Startbildschirm verbergen und Budget-Einstellungen anzeigen
document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('budgetSettings').style.display = 'block';
});

// Darkmode-Switch
document.getElementById('toggleMode').addEventListener('click', () => {
    document.body.classList.toggle('darkmode');
});

// Budget speichern und Fenster umschalten
document.getElementById('budgetForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const currency = document.getElementById('currency').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const interval = document.getElementById('interval').value;

    if (amount <= 0 || isNaN(amount)) {
        alert('Bitte geben Sie ein gültiges Budget ein!');
        return;
    }

    localStorage.setItem('budgetCurrency', currency);
    localStorage.setItem('budgetAmount', amount);
    localStorage.setItem('budgetInterval', interval);
    localStorage.setItem('budgetRemaining', amount);
    localStorage.setItem('budgetSet', 'true');

    alert('Budget gespeichert!');
    
    updateBudgetDisplay();
    document.getElementById('budgetSettings').style.display = 'none';
    document.getElementById('expenseWindow').style.display = 'block';
});

// Überprüft, ob ein Budget existiert
function checkBudget() {
    const budgetSet = localStorage.getItem('budgetSet');
    if (budgetSet) {
        document.getElementById('intro').style.display = 'none';
        document.getElementById('budgetSettings').style.display = 'none';
        document.getElementById('expenseWindow').style.display = 'block';
        updateBudgetDisplay();
    } else {
        document.getElementById('intro').style.display = 'block';
    }
}

// Aktualisiert die Budget-Anzeige
function updateBudgetDisplay() {
    const currency = localStorage.getItem('budgetCurrency') || '€';
    let remaining = parseFloat(localStorage.getItem('budgetRemaining')) || 0;
    let total = parseFloat(localStorage.getItem('budgetAmount')) || 0;

    document.getElementById('totalBudget').innerText = total.toFixed(2) + " " + currency;
    document.getElementById('remainingBudget').innerText = remaining.toFixed(2) + " " + currency;

    const percentage = (remaining / total) * 100;
    const displayDiv = document.getElementById('budgetDisplay');

    if (percentage > 50) {
        displayDiv.className = 'green';
    } else if (percentage > 10) {
        displayDiv.className = 'yellow';
    } else {
        displayDiv.className = 'red';
        if (percentage <= 1) {
            alert('⚠️ Achtung! Weniger als 1% Budget übrig.');
        }
        if (remaining <= 0) {
            alert('❌ Budget vollständig aufgebraucht!');
        }
    }

    document.getElementById('budgetDisplay').style.display = 'block';
}

// Ausgabe hinzufügen
document.getElementById('expenseForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const reason = document.getElementById('expenseReason').value;
    const date = document.getElementById('expenseDate').value;

    if (amount <= 0 || isNaN(amount)) {
        alert('Bitte geben Sie einen gültigen Betrag ein!');
        return;
    }

    let remaining = parseFloat(localStorage.getItem('budgetRemaining')) || 0;
    remaining -= amount;
    localStorage.setItem('budgetRemaining', remaining);

    let expenseData = JSON.parse(localStorage.getItem('expenseData')) || [];
    expenseData.push({ date, amount, reason });
    localStorage.setItem('expenseData', JSON.stringify(expenseData));

    alert(`✅ Ausgabe von ${amount}€ für "${reason}" hinzugefügt!`);

    updateBudgetDisplay();
    renderChart();
});

// Graph erstellen oder aktualisieren
function renderChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const data = JSON.parse(localStorage.getItem('expenseData')) || [];

    const labels = data.map(entry => entry.date);
    const values = data.map(entry => entry.amount);

    if (window.expenseChart) {
        window.expenseChart.destroy();
    }

    window.expenseChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ausgaben',
                data: values,
                borderColor: 'red',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    document.getElementById('chartContainer').style.display = 'block';
}

// Graph umschalten
document.getElementById('toggleGraphBtn').addEventListener('click', () => {
    const chartContainer = document.getElementById('chartContainer');
    chartContainer.style.display = chartContainer.style.display === 'none' ? 'block' : 'none';
});

// Initialer Budget-Check
checkBudget();
