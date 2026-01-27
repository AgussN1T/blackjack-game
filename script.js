import config from './config.js';

function generarMazo(mazo, config) {
    let cartasTotales = [];
    let valores = config.valores;
    let palos = config.palos;

    for (let k = 0; k < config.mazos; k++) {
        for (let i = 0; i < valores.length; i++) {
            for (let j = 0; j < palos.length; j++) {
                cartasTotales.push({ valor: valores[i], palo: palos[j] });
            }
        }
    }

    let cantCartas = cartasTotales.length;
    for (let i = 0; i < cantCartas; i++) {
        let indexR = Math.floor(Math.random() * cartasTotales.length);
        let carta = cartasTotales.splice(indexR, 1)[0];
        mazo.push(carta);

    }

    while (cartasTotales.length > 0) {
        let indexR = Math.floor(Math.random() * cartasTotales.length);
        let carta = cartasTotales.splice(indexR, 1)[0];
        mazo.push(carta);
    }

}

function hit(mesa, contenedor, mazo) {

    if (mazo.length === 0) throw console.error();

    mesa.push(mazo.splice(0, 1)[0]);

    mostrarCartas(mesa, contenedor);

    puntajeJugador.textContent = calcularMano(mesa);
}

function stand() {
    btnDeal.disabled = true;
    btnHit.disabled = true;
    btnStand.disabled = true;
    btnDouble.disabled = true;
    actualizarEstado("STAND");
}

function doubleDown() {

    if (fichasJugador >= apuesta) {
        fichasJugador -= apuesta;
        apuesta = apuesta * 2;
        hit(mesaJugador, mazo);
        btnHit.disabled = true;
        btnStand.disabled = true;
        btnDouble.disabled = true;

        //terminar pendiente
    }
    else {
        console.log('No tienes suficientes fichas');
    }
    return;
}

function mostrarCartas(mesa, contenedor) {
    contenedor.innerHTML = '';

    mesa.forEach((carta, index) => {
        const divCarta = document.createElement('div');

        // divCarta.style.left = `${index * 30}px`;
        // divCarta.style.top = '0px';
        // divCarta.style.zIndex = index;

        divCarta.classList.add('carta');
        if (carta.palo === '♥️' || carta.palo === '♦️') divCarta.classList.add("roja");
        renderizarCarta(divCarta, carta);

        divCarta.dataset.index = index;
        contenedor.appendChild(divCarta);
    });
}

function renderizarCarta(divCarta, carta) {

    if (carta.valor === 1) {
        divCarta.innerHTML = `
        <div class="valor arriba">A</div>
        <div class="palo">${carta.palo}</div>
        <div class="valor abajo">A</div>
    `;
        return;
    }

    if (carta.valor <= 10) {
        divCarta.innerHTML = `
        <div class="valor arriba">${carta.valor}</div>
        <div class="palo">${carta.palo}</div>
        <div class="valor abajo">${carta.valor}</div>
    `;
        return;
    }

    if (carta.valor === 11) {
        divCarta.innerHTML = `
        <div class="valor arriba">J</div>
        <div class="palo">${carta.palo}</div>
        <div class="valor abajo">J</div>
    `;
        return;
    }
    if (carta.valor === 12) {
        divCarta.innerHTML = `
        <div class="valor arriba">Q</div>
        <div class="palo">${carta.palo}</div>
        <div class="valor abajo">Q</div>
    `;
        return;
    }
    if (carta.valor === 13) {
        divCarta.innerHTML = `
        <div class="valor arriba">K</div>
        <div class="palo">${carta.palo}</div>
        <div class="valor abajo">K</div>
    `;
        return;
    }
}


const mazo = [];
const mesaJugador = [];
const mesaCroupier = [];
let fichasJugador = 500;
let apuesta = 0;

let estado = "";

let puntuacionTotal = 0;

// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// await delay(2000);

const contenedorCrupier = document.getElementById('container-crupier');
const contenedorJugador = document.getElementById('container-jugador');

// Apuestas
const saldoJugador = document.getElementById('saldo');
const valorApuesta = document.getElementById('valor-apuesta');
const btnBajarApuesta = document.getElementById('btn-bajar-apuesta');
const btnSubirApuesta = document.getElementById('btn-subir-apuesta');
const btnRepetirApuesta = document.getElementById('btn-repetir-apuesta');

function actualizarApuesta() {
    valorApuesta.textContent = apuesta;
}

btnBajarApuesta.addEventListener('click', () => {
    if (apuesta - 25 >= 0) {
        apuesta -= 25;
        actualizarApuesta();
    }
});

btnSubirApuesta.addEventListener('click', () => {
    if (apuesta + 25 <= fichasJugador) {
        apuesta += 25;
        actualizarApuesta();
    }
});

//botones de juego
const btnDeal = document.getElementById('btn-deal');
const btnHit = document.getElementById('btn-hit');
const btnStand = document.getElementById('btn-stand');
const btnDouble = document.getElementById('btn-double');

btnHit.addEventListener('click', () => {
    hit(mesaJugador, contenedorJugador, mazo);
});

btnStand.addEventListener('click', () => {
    if (estado === "STAND") {
        stand();
    }
    calcularMano(mesaJugador);
    stand();
});

btnDeal.addEventListener('click', () => {
    deal();

});


function deal(){
    if (apuesta > 0) {
        fichasJugador -= apuesta;
        saldoJugador.textContent = fichasJugador;

        apuestaAnterior = apuesta;

        hit(mesaJugador, contenedorJugador, mazo);
        hit(mesaJugador, contenedorJugador, mazo);

        // hit(mesaCroupier, contenedorCrupier, mazo);
        // hit(mesaCroupier, contenedorCrupier, mazo);

        btnDeal.disabled = true;
        btnHit.disabled = false;
        btnStand.disabled = false;
        btnDouble.disabled = false;

        btnBajarApuesta.disabled = true;
        btnSubirApuesta.disabled = true;

        mostrarCartas(mesaJugador, contenedorJugador);
        mostrarCartas(mesaCroupier, contenedorCrupier);

        actualizarEstado("Turno del jugador");

    } else {
        alert("Haz una apuesta primero");
    }
}


//puntajes y estado
const puntajeJugador = document.getElementById('puntos-jugador');
const puntajeCroupier = document.getElementById('puntos-jugador');
const estadoPartida = document.getElementById('estado-partida');

let apuestaAnterior = 0;

function actualizarEstado(nuevoEstado) {
    estado = nuevoEstado;
    estadoPartida.textContent = estado;
}


function calcularMano(mesa) {

    let puntajeTotal = 0;
    let cantAses = 0;

    for (let i = 0; i < mesa.length; i++) {
        if (mesa[i].valor === 1) {
            puntajeTotal += 11;
            cantAses++;
            continue;
        }
        if (mesa[i].valor < 10) {
            puntajeTotal += mesa[i].valor;
        }

        if (mesa[i].valor >= 10) {
            puntajeTotal += 10
        }
    }

    if ((puntajeTotal === 21)) {
        if (mesa.length === 2) {
            actualizarEstado("BLACKJACK");
        }
    }

    if (puntajeTotal > 21) {

        if (cantAses > 0) {
            for (let i = 0; i < cantAses; i++) {
                puntajeTotal -= 10;
                if(puntajeTotal <= 21){
                    break;
                }
            }
            if(puntajeTotal > 21){
                actualizarEstado("BUST");
            }
        }
        else {
            actualizarEstado("BUST");
        }

    }
    
    return puntajeTotal;
}

function iniciarJuego() {
    mazo.length = 0;
    mesaCroupier.length = 0;
    mesaJugador.length = 0;
    fichasJugador = 0;
    apuesta = 0;

    btnHit.disabled = true;
    btnStand.disabled = true
    btnDouble.disabled = true;


    generarMazo(mazo, config);

    fichasJugador = 200;
    saldoJugador.textContent = fichasJugador;

}

iniciarJuego()


// const puntajeJugador = document.getElementById('puntos-jugador');
// const puntajeCroupier = document.getElementById('puntos-jugador');
// const estadoPartida = document.getElementById('estado-partida');


function resetearJuego(){
    saldoJugador.textContent = fichasJugador;
    mesaCroupier.length = 0;
    mesaJugador.length = 0;
    
    estadoPartida.textContent = "Ingrese una apuesta"
    puntajeJugador.textContent = "?"
    puntajeCroupier.textContent = "?"
    
    btnDeal.disabled = false;
    btnRepetirApuesta.disable = false;
    btnBajarApuesta.disable = false;
    btnSubirApuesta.disable = false;
    
    
}

