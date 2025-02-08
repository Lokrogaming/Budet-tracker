function saveSettings() {
    const currency = document.getElementById("currency").value;
    const budget = document.getElementById("budget").value;

    if (!budget || budget <= 0) {
        alert("Bitte ein gültiges Budget eingeben!");
        return;
    }

    const settings = {
        currency: currency,
        budget: parseFloat(budget)
    };

    localStorage.setItem("budgetSettings", JSON.stringify(settings));
    alert("Einstellungen gespeichert!");
}

