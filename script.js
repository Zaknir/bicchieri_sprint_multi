const CONFIG = {
    DIREZIONI: ["Da SINISTRA a DESTRA", "Da DESTRA a SINISTRA", "Dall'ALTO al BASSO", "Dal BASSO all'ALTO"],
    MAX_STORICO: 5
};

const state = {
    storico: []
};

// Selettori DOM
const btnEstrai = document.getElementById('btnEstrai');
const displayRisultato = document.getElementById('risultato');
const inputs = document.querySelectorAll('.input-oggetto');

/**
 * Utility per rimescolare array (Fisher-Yates)
 */
function shuffle(array) {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

/**
 * Gestione estrazione
 */
function handleExtraction() {
    // 1. Recupera i valori dai 5 input
    const oggetti = Array.from(inputs).map(i => i.value.trim() || "Vuoto");
    
    let combinazioneChiave;
    let direzioneScelta;
    let ordineScelto;

    // 2. Calcola combinazione univoca
    let tentativi = 0;
    do {
        direzioneScelta = CONFIG.DIREZIONI[Math.floor(Math.random() * CONFIG.DIREZIONI.length)];
        ordineScelto = shuffle(oggetti);
        combinazioneChiave = `${direzioneScelta}|${ordineScelto.join(',')}`;
        tentativi++;
    } while (state.storico.includes(combinazioneChiave) && tentativi < 20);

    // 3. Aggiorna stato storico
    state.storico.unshift(combinazioneChiave);
    if (state.storico.length > CONFIG.MAX_STORICO) state.storico.pop();

    // 4. Aggiorna Interfaccia Utente
    displayRisultato.textContent = `${direzioneScelta}: ${ordineScelto.join(', ')}.`;
}

// Inizializzazione Eventi
inputs.forEach(input => {
    input.addEventListener('focus', () => input.select());
});

btnEstrai.addEventListener('click', handleExtraction);

// Registrazione Service Worker per PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log("Service Worker Registrato"))
    .catch(err => console.log("Errore SW:", err));
}
