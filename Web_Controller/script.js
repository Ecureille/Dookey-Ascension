const socket = new WebSocket('ws://192.168.1.XX:8080'); // Mets ton IP locale ici
const curseur = document.getElementById('curseur');
const cases = document.querySelectorAll('.case-score');

let position = 0;
let direction = 1;
let estArrete = false;
const vitesse = 1.5; 

// Fonction pour mélanger l'ordre des chiffres
function melangerChiffres() {
    // Créer un tableau [1, 2, 3, 4, 5, 6] et le mélanger aléatoirement
    let chiffres = [1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5);
    
    // Assigner les nouveaux chiffres aux cases
    cases.forEach((elementCase, index) => {
        elementCase.innerText = chiffres[index];
        // On garde la valeur en mémoire pour savoir quel chiffre est où
        elementCase.dataset.valeur = chiffres[index]; 
    });
}

function animer() {
    if (estArrete) return;

    position += vitesse * direction;
    
    // Rebond sur les bords
    if (position >= 100) { position = 100; direction = -1; }
    else if (position <= 0) { position = 0; direction = 1; }
    
    curseur.style.left = position + "%";

    // Identifier la case sous le curseur (0 à 5)
    let index = Math.min(Math.floor(position / (100 / 6)), 5);
    
    // Gérer l'allumage des cases
    cases.forEach((c, i) => {
        if (i === index) {
            c.classList.add('case-active');
        } else {
            c.classList.remove('case-active');
        }
    });

    requestAnimationFrame(animer);
}

// 1. On mélange et on lance au démarrage
melangerChiffres();
animer();

// 2. Gestion du clic
document.getElementById('ecran-cliquable').onclick = () => {
    if (!estArrete && socket.readyState === WebSocket.OPEN) {
        estArrete = true;
        
        // On récupère le score sur lequel le joueur s'est arrêté
        let indexArret = Math.min(Math.floor(position / (100 / 6)), 5);
        let scoreObtenu = cases[indexArret].innerText;
        
        // On envoie "CLIC" + le score (ex: "CLIC:6")
        socket.send("CLIC:" + scoreObtenu);
        
        // Flash Vert Doux
        document.body.style.backgroundColor = "#4caf50"; 
        
        setTimeout(() => { 
            document.body.style.transition = "background-color 0.5s";
            document.body.style.backgroundColor = "#1a1a1a";
            
            // Relance après 2 secondes avec un NOUVEAU mélange
            setTimeout(() => { 
                document.body.style.transition = "none";
                estArrete = false; 
                melangerChiffres(); // <-- C'est ici que ça change tout !
                animer(); 
            }, 2000);
        }, 150);
    }
};