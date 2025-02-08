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

// Funktion zum Speichern der Budgetdaten und Anzeigen des Ausgabefensters
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

    // Ausgabefenster anzeigen
    document.getElementById('expenseWindow').style.display = 'block';
    document.getElementById('budgetSettings').style.display = 'none';  // Budget Form ausblenden
});

// Funktion zum Hinzufügen einer Ausgabe
document.getElementById('expenseForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const expenseAmount = parseFloat(document.getElementById('expenseAmount').value);
    const expenseReason = document.getElementById('expenseReason').value;

    // Hier könnte man die Ausgabe speichern und in einer Liste oder Tabelle anzeigen
    console.log(`Ausgabe: ${expenseAmount} | Grund: ${expenseReason}`);
    alert(`Ausgabe von ${expenseAmount} hinzugefügt!`);

    // Felder zurücksetzen und ausblenden
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseReason').value = '';
});
