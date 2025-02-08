document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('budgetSettings').style.display = 'block';
});

document.getElementById('toggleMode').addEventListener('click', () => {
    document.body.classList.toggle('darkmode');
});

document.getElementById('toggleGraphBtn').addEventListener('click', () => {
    const canvas = document.getElementById('expenseChart');
    canvas.style.display = canvas.style.display === 'none' ? 'block' : 'none';
});

// Funktion zum Speichern der Budgetdaten
document.getElementById('budgetForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const currency = document.getElementById('currency').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const interval = document.getElementById('interval').value;

    // Speichern der Daten (z. B. LocalStorage oder eine API)
    localStorage.setItem('budgetCurrency', currency);
    localStorage.setItem('budgetAmount', amount);
    localStorage.setItem('budgetInterval', interval);

    alert('Budget gespeichert!');
});
