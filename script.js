// Definer de politiske partiene
let partier = ['Arbeiderpartiet', 'Venstre', 'Senterpartiet', 'Fremskrittspartiet', 'Høyre'];

// Funksjon for å håndtere radioknappene
function check(input) {
    // Velg alle radioknapper med samme navneattributt som den klikkede inndata
    var checkboxes = document.querySelectorAll('input[type="radio"][name="' + input.name + '"]');
    // Gå gjennom alle radioknappene i gruppen
    checkboxes.forEach(function(checkbox) {
        // Fjerner merket for alle radioknappene unntatt den klikket
        if (checkbox !== input) {
            checkbox.checked = false;
        }
    });
}

// Teller for totalt antall stemmer
let voteCount = 0;

// Få diagrammteksten for Chart.js-diagrammet
const ctx = document.getElementById('myChart').getContext('2d');

// Innledende kartdata med etiketter og datasett for stemmer
const chartData = {
    labels: partier,
    datasets: [{
        label: '# of Votes',
        data: [0, 0, 0, 0, 0],
        borderWidth: 1
    }]
};


// Opprett en ny Chart.js-forekomst med de angitte diagramdataene og valgene
const myChart = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Funksjon for å håndtere stemmeprosessen
function vote() {
    // Hent brukernavnet fra input-feltet
    const voterName = document.querySelector('input[name="Navn"]').value.trim();

    // Sjekk om brukeren allerede har stemt
    const hasVoted = localStorage.getItem(`${voterName}_voted`);
    if (hasVoted) {
        alert('Beklager, du har allerede stemt.');
        return;
    }

    // Øk det totale antallet stemmer
    voteCount++;

    // Hent den valgte radioknappen
    var input = document.querySelector('input[name="Parti"]:checked');

    if (input) {
        // Hent verdien (parti) til den valgte radioknappen
        var selectedParty = input.value;

        // Logg informasjon til konsollen for feilsøking
        console.log('Valgt Parti:', selectedParty);
        console.log('Politiske Partier:', partier);
        console.log('Stemmedata:', chartData.datasets[0].data);

        // Oppdater den viste stemmetellingen
        document.getElementById('voteCount').innerText = 'Stemmer: ' + voteCount;

        // Finn indeksen til det valgte partiet i rekken av partier
        let nr = partier.indexOf(selectedParty);
        console.log('Indeks til Valgt Parti:', nr);

        // Øk stemmetallet for det valgte partiet
        chartData.datasets[0].data[nr]++;

        // Oppdater diagrammet for å gjenspeile endringene
        myChart.update();

        // Lagre at brukeren har stemt for å hindre flere stemmer
        localStorage.setItem(`${voterName}_voted`, true);

        // Lagre det oppdaterte stemmetallet og partistemmene i local storage
        localStorage.setItem('voteCount', voteCount);
        localStorage.setItem('partyVotes', JSON.stringify(chartData.datasets[0].data));
    } else {
        // Vis en melding hvis ingen parti er valgt
        alert('Vennligst velg et parti før du stemmer.');
    }
}

// Funksjon for å initialisere stemmedata fra local storage ved sideinnlasting
function initializeVotingData() {
    const storedVoteCount = localStorage.getItem('voteCount');
    const storedPartyVotes = localStorage.getItem('partyVotes');

    if (storedVoteCount && storedPartyVotes) {
        // Oppdater det totale stemmetallet
        voteCount = parseInt(storedVoteCount, 10);
        document.getElementById('voteCount').innerText = 'Stemmer: ' + voteCount;

        // Oppdater partistemmene
        chartData.datasets[0].data = JSON.parse(storedPartyVotes);
        myChart.update();
    }
}


// Function to reset voting data
function resetVoting() {
    // Reset total vote count
    voteCount = 0;
    document.getElementById('voteCount').innerText = 'Stemmer: ' + voteCount;

    // Reset party votes
    chartData.datasets[0].data = [0, 0, 0, 0, 0];
    myChart.update();

    // Clear localStorage
    localStorage.clear();
}

// Kall initialiseringsfunksjonen ved sideinnlasting
initializeVotingData();




