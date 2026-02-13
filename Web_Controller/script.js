// --- MODIFIE L'IP ICI AVANT DE PUSHER SUR GIT ---
// Si tu es en partage de connexion : met l'IP de ton PC (ex: 192.168.137.1)
// Si tu utilises Ngrok : met l'adresse wss://...
const socket = new WebSocket('wss://https://https://ecureille.github.io/Dookey-Ascension/Web_Controller');

const curseur = document.getElementById('curseur');
const cases = document.querySelectorAll('.case-score');
const debug = document.getElementById('debug');
let position = 0;
let direction = 1;
let estArrete = false;
let socket;

function connecter() {
    socket = new WebSocket(ADRESSE_PC);

    socket.onopen = () => {
        debug.innerText = "Connecté à " + ADRESSE_PC;
        debug.style.color = "green";
    };

    socket.onclose = () => {
        debug.innerText = "Déconnecté. Nouvelle tentative...";
        debug.style.color = "red";
        setTimeout(connecter, 3000); // Réessaie dans 3s
    };

    socket.onerror = (e) => {
        debug.innerText = "Erreur connexion. Vérifie l'IP.";
    };
}

function melangerChiffres() {
    let chiffres = [1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5);
    cases.forEach((el, index) => { el.innerText = chiffres[index]; });
}

function animer() {
    if (estArrete) return;
    position += 1.5 * direction;
    if (position >= 100) { position = 100; direction = -1; }
    if (position <= 0) { position = 0; direction = 1; }
    
    curseur.style.left = position + "%";
    
    let index = Math.min(Math.floor(position / (100 / 6)), 5);
    cases.forEach((c, i) => {
        if (i === index) c.classList.add('case-active');
        else c.classList.remove('case-active');
    });
    requestAnimationFrame(animer);
}

// Clic
document.getElementById('ecran-jeu').onclick = () => {
    if (!estArrete && socket.readyState === WebSocket.OPEN) {
        estArrete = true;
        let index = Math.min(Math.floor(position / (100 / 6)), 5);
        let score = cases[index].innerText;

        socket.send("CLIC:" + score);

        document.body.style.backgroundColor = "#4caf50";
        setTimeout(() => {
            document.body.style.backgroundColor = "#1a1a1a";
            setTimeout(() => { 
                estArrete = false; 
                melangerChiffres(); 
                animer(); 
            }, 2000);
        }, 200);
    }
};

// Lancement
melangerChiffres();
animer();
connecter();

