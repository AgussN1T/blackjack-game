import config from './config.js';

function generarMazo(mazo) {
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


const mazo = [];
const mesaJugador = [];
const mesaCrupier = [];
let fichasJugador = 500;
let apuesta = 0;

let estado = "";


function hit(mesa, contenedor) {
    if (mazo.length === 0) generarMazo(mazo);
    mesa.push(mazo.shift());
    mostrarCartas(mesa, contenedor);

    return calcularMano(mesa);
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function crupier() {
    if (puntajeCrupier === "BLACKJACK") return;

    while (puntajeCrupier < 17 && puntajeCrupier != "BUST") {
        puntajeCrupier = hit(mesaCrupier, contenedorCrupier);
        mostrarCartas(mesaCrupier, contenedorCrupier);
        feedbackPuntajeCrupier.textContent = puntajeCrupier;
        await delay(1000);
    }

    if (puntajeCrupier === "BUST") {
        return;
    }

    if (puntajeCrupier > puntajeJugador) {
        return;
    }
    else {
        while (puntajeCrupier < puntajeJugador && puntajeCrupier != "BUST") {
            puntajeCrupier = hit(mesaCrupier, contenedorCrupier);
            mostrarCartas(mesaCrupier, contenedorCrupier);
            feedbackPuntajeCrupier.textContent = puntajeCrupier;
            await delay(1000);
        }
    }

    return;
}


async function stand() {

    btnStand.disabled = true;
    btnHit.disabled = true;
    btnDouble.disabled = true;

    if (puntajeJugador === "BUST") {
        setTimeout(() => {
            console.log(puntajeJugador);
            resetearJuego();
        }, 4000);
        actualizarEstado("La Casa Gana");
        return;
    }

    await crupier();

    if (puntajeJugador === puntajeCrupier) {
        setTimeout(() => {
            pagar(apuesta);
            resetearJuego();
        }, 4000);
        actualizarEstado("PUSH");
        return;
    }

    if (puntajeCrupier === "BUST") {
        setTimeout(() => {
            pagar(apuesta * 2);
            resetearJuego();
        }, 4000);
        actualizarEstado("El Jugador Gana");
        return;
    }

    if (puntajeJugador === "BLACKJACK" && puntajeCrupier != "BLACKJACK") {
        setTimeout(() => {
            pagar(apuesta * 2.5);
            resetearJuego();
        }, 4000);
        actualizarEstado("El Jugador Gana");
        return;

    }

    if (puntajeJugador > puntajeCrupier) {
        setTimeout(() => {
            pagar(apuesta * 2);
            resetearJuego();
        }, 4000);
        actualizarEstado("El Jugador Gana");
        return;
    }
    else {
        setTimeout(() => {
            resetearJuego();
        }, 4000);
        actualizarEstado("La Casa Gana");
        return;
    }


}

function pagar(monto) {
    fichasJugador += monto;
    saldoJugador.textContent = fichasJugador;
    // console.log(monto);
}

function doubleDown() {

    if (fichasJugador >= apuesta * 2) {
        btnHit.disabled = true;
        btnStand.disabled = true;
        btnDouble.disabled = true;

        fichasJugador -= apuesta;
        apuesta = apuesta * 2;
        puntajeJugador = hit(mesaJugador, contenedorJugador);
        feedbackPuntajeJugador.textContent = puntajeJugador;
        stand();

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

        divCarta.classList.add('carta');
        // divCarta.classList.add('animado');
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

btnRepetirApuesta.addEventListener('click', () => {
    if (apuestaAnterior <= fichasJugador) {
        apuesta = apuestaAnterior;
        btnBajarApuesta.disabled = false;
        actualizarApuesta();
        btnDeal.disabled = false;

        if (apuestaAnterior === fichasJugador) {
            btnSubirApuesta.disabled = false;
        }

    }

});



btnBajarApuesta.addEventListener('click', () => {
    if (apuesta - 25 >= 0) {
        apuesta -= 25;
        actualizarApuesta();
        btnSubirApuesta.disabled = false;
    }

    if (apuesta === 0) {
        btnDeal.disabled = true;
        btnBajarApuesta.disabled = true;
    }

});

btnSubirApuesta.addEventListener('click', () => {
    if (apuesta + 25 <= fichasJugador) {
        apuesta += 25;
        actualizarApuesta();
        btnBajarApuesta.disabled = false;
        btnDeal.disabled = false;
    }
    if (fichasJugador - apuesta === 0) {
        btnSubirApuesta.disabled = true;
    }

});

//botones de juego
const btnDeal = document.getElementById('btn-deal');
const btnHit = document.getElementById('btn-hit');
const btnStand = document.getElementById('btn-stand');
const btnDouble = document.getElementById('btn-double');

btnHit.addEventListener('click', () => {
    puntajeJugador = hit(mesaJugador, contenedorJugador);
    feedbackPuntajeJugador.textContent = puntajeJugador;
    if (puntajeJugador === "BLACKJACK" || puntajeJugador === 21 || estado === "BUST") {
        stand();
    }
});

btnStand.addEventListener('click', () => {

    btnDeal.disabled = true;
    btnHit.disabled = true;
    btnStand.disabled = true;
    btnDouble.disabled = true;

    stand();
});

btnDeal.addEventListener('click', () => {
    deal();

});


function deal() {
    if (apuesta > 0) {

        fichasJugador -= apuesta;
        saldoJugador.textContent = fichasJugador;

        apuestaAnterior = apuesta;
        actualizarEstado("Turno del jugador");

        hit(mesaJugador, contenedorJugador);
        hit(mesaJugador, contenedorJugador);
        
        hit(mesaCrupier,contenedorCrupier);

        btnDeal.disabled = true;
        btnHit.disabled = false;
        btnStand.disabled = false;
        btnDouble.disabled = false;

        btnBajarApuesta.disabled = true;
        btnSubirApuesta.disabled = true;

        mostrarCartas(mesaJugador, contenedorJugador);
        mostrarCartas(mesaCrupier,contenedorCrupier);

        puntajeCrupier = calcularMano(mesaCrupier);
        puntajeJugador = calcularMano(mesaJugador);

        feedbackPuntajeJugador.textContent = puntajeJugador;
        feedbackPuntajeCrupier.textContent = puntajeCrupier;
    } else {
        alert("Haz una apuesta primero");
    }
}


    btnDouble.addEventListener('click', () => {
        doubleDown();

    });

function actualizarEstado(nuevoEstado) {
    estado = nuevoEstado;
    estadoPartida.textContent = estado;
}


function calcularMano(mesa) {

    let puntajeTotal = 0;
    let cantAses = 0;

    if (mesa.length === 0) return 0;

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
            return "BLACKJACK";
        }
    }

    if (puntajeTotal > 21) {

        if (cantAses > 0) {
            for (let i = 0; i < cantAses; i++) {
                puntajeTotal -= 10;
                if (puntajeTotal <= 21) {
                    break;
                }
            }
            if (puntajeTotal > 21) {
                actualizarEstado("BUST");
                return "BUST";
            }
        }
        else {
            actualizarEstado("BUST");
            return "BUST";
        }

    }

    return puntajeTotal;
}




// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// await delay(2000);

//puntajes y estado
const feedbackPuntajeJugador = document.getElementById('puntos-jugador');
const feedbackPuntajeCrupier = document.getElementById('puntos-crupier');
const estadoPartida = document.getElementById('estado-partida');

let apuestaAnterior = 0;

let puntajeJugador = 0;
let puntajeCrupier = 0;


// document.getElementById("modal-derrota").classList.add("hidden");

const btnModalReintentar = document.querySelector('.joker-btn');

  btnModalReintentar.addEventListener('click', () => {
    btnModalReintentar.classList.add('clicked');

    setTimeout(() => {
      btnModalReintentar.classList.remove('clicked');
      location.reload();
    }, 600);
  });



function resetearJuego() {

    if(fichasJugador === 0) document.getElementById("modal-derrota").classList.remove("hidden");

    apuestaAnterior = apuesta;


    apuesta = 0;
    estado = "";

    saldoJugador.textContent = fichasJugador;

    mesaCrupier.length = 0;
    mesaJugador.length = 0;
    mostrarCartas(mesaJugador, contenedorJugador);
    mostrarCartas(mesaCrupier, contenedorCrupier);

    estadoPartida.textContent = "Ingrese una apuesta"
    feedbackPuntajeJugador.textContent = "---"
    feedbackPuntajeCrupier.textContent = "---"
    valorApuesta.textContent = 0;

    btnRepetirApuesta.disabled = false;
    btnBajarApuesta.disabled = true;
    btnSubirApuesta.disabled = false;

}


function iniciarJuego() {
    mazo.length = 0;
    mesaCrupier.length = 0;
    mesaJugador.length = 0;
    fichasJugador = 0;
    apuesta = 0;

    btnDeal.disabled = true;
    btnHit.disabled = true;
    btnStand.disabled = true
    btnDouble.disabled = true;

    btnBajarApuesta.disabled = true;

    generarMazo(mazo);

    fichasJugador = config.fichasIniciales;
    saldoJugador.textContent = fichasJugador;

}

iniciarJuego()




// const puntajeJugador = document.getElementById('puntos-jugador');
// const puntajeCrupier = document.getElementById('puntos-jugador');
// const estadoPartida = document.getElementById('estado-partida');




