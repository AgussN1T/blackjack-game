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

    while (cartasTotales.length > 0) {
        const index = Math.floor(Math.random() * cartasTotales.length);
        mazo.push(cartasTotales.splice(index, 1)[0]);
    }

}


const juego = {
    mazo: [],
    mesaJugador: [],
    mesaCrupier: [],
    fichasJugador: 0,
    puntuacionJuego: 0,
    apuesta: 0,
    apuestaAnterior: 0,
    puntajeJugador: 0,
    puntajeCrupier: 0
}



function hit(mesa, contenedor) {
    if (juego.mazo.length === 0) generarMazo(juego.mazo);
    mesa.push(juego.mazo.shift());
    mostrarCartas(mesa, contenedor, false);

    return calcularMano(mesa);
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function crupier() {
/* 
    if (juego.puntajeJugador === "BLACKJACK" && juego.mesaCrupier.length === 2 && juego.puntajeCrupier != "BLACKJACK") return;

    if (juego.puntajeCrupier === "BLACKJACK") return;

    while (juego.puntajeCrupier < 17 && juego.puntajeCrupier != "BUST") {
        juego.puntajeCrupier = hit(juego.mesaCrupier, contenedorCrupier);
        mostrarCartas(juego.mesaCrupier, contenedorCrupier);
        feedbackPuntajeCrupier.textContent = juego.puntajeCrupier;
        await delay(1000);
    }

    if (juego.puntajeCrupier === "BUST") {
        return;
    }

    if (juego.puntajeCrupier > juego.puntajeJugador) {
        return;
    }
    else {
        while (juego.puntajeCrupier < juego.puntajeJugador && juego.puntajeCrupier != "BUST") {
            juego.puntajeCrupier = hit(juego.mesaCrupier, contenedorCrupier);
            mostrarCartas(juego.mesaCrupier, contenedorCrupier);
            feedbackPuntajeCrupier.textContent = juego.puntajeCrupier;
            await delay(1000);
        }
    }
 */

        juego.puntajeCrupier = calcularMano(juego.mesaCrupier);
        mostrarCartas(juego.mesaCrupier, contenedorCrupier, false);
        feedbackPuntajeCrupier.textContent = juego.puntajeCrupier;
        await delay(1000);

        if (
            juego.mesaCrupier.length === 2 &&
            juego.puntajeJugador === "BLACKJACK" &&
            juego.puntajeCrupier !== "BLACKJACK"
        ) return;
    
        if (juego.puntajeCrupier === "BLACKJACK") return;
    
        const pedirCarta = async () => {
            juego.puntajeCrupier = hit(juego.mesaCrupier, contenedorCrupier);
            mostrarCartas(juego.mesaCrupier, contenedorCrupier, false);
            feedbackPuntajeCrupier.textContent = juego.puntajeCrupier;
            await delay(1000);
        };
    
        while (juego.puntajeCrupier < 17 && juego.puntajeCrupier !== "BUST") {
            await pedirCarta();
        }
    
        if (juego.puntajeCrupier === "BUST" || juego.puntajeCrupier > juego.puntajeJugador) return;
    
        while (juego.puntajeCrupier < juego.puntajeJugador && juego.puntajeCrupier !== "BUST") {
            await pedirCarta();
        }
     
    return;
}

async function stand() {

    btnStand.disabled = true;
    btnHit.disabled = true;
    btnDouble.disabled = true;

    if (juego.puntajeJugador === "BUST") {
        finalizarRonda("La Casa Gana", 0);
        return;
    }

    await crupier();

    if (juego.puntajeJugador === juego.puntajeCrupier) {
        finalizarRonda("PUSH", juego.apuesta);
        return;
    }

    if (juego.puntajeCrupier === "BUST") {
        finalizarRonda("El Jugador Gana " + juego.apuesta * 2);
        return;
    }

    if (juego.puntajeJugador === "BLACKJACK" && juego.puntajeCrupier != "BLACKJACK") {
        finalizarRonda("El Jugador Gana " + juego.apuesta * 2.5);
        return;
    }

    if (juego.puntajeJugador > juego.puntajeCrupier) {
        finalizarRonda("El Jugador Gana ", juego.apuesta * 2);
        return;
    }
    else {

        finalizarRonda("La Casa Gana", 0);
        return;
    }
}

function finalizarRonda(mensaje, pago = 0) {
    actualizarEstado(mensaje);
    setTimeout(() => {
        if (pago > 0) pagar(pago);
        resetearJuego();
    }, 4000);
}





function pagar(monto) {
    juego.fichasJugador += monto;
    saldoJugador.textContent = juego.fichasJugador;
    // console.log(monto);
}

function doubleDown() {

    if (juego.fichasJugador >= juego.apuesta * 2) {
        btnHit.disabled = true;
        btnStand.disabled = true;
        btnDouble.disabled = true;

        juego.fichasJugador -= juego.apuesta;
        juego.apuesta = juego.apuesta * 2;

        actualizarApuesta();
        saldoJugador.textContent = juego.fichasJugador;

        juego.puntajeJugador = hit(juego.mesaJugador, contenedorJugador);
        feedbackPuntajeJugador.textContent = juego.puntajeJugador;
        stand();

        //terminar pendiente
    }
    else {
        console.log('No tienes suficientes fichas');
    }
    return;
}

function mostrarCartas(mesa, contenedor, ocultarSegunda) {
    contenedor.innerHTML = '';
/* 
    mesa.forEach((carta, index) => {
        const divCarta = document.createElement('div');

        divCarta.classList.add('carta');
        // divCarta.classList.add('animado');
        if (carta.palo === '♥️' || carta.palo === '♦️') divCarta.classList.add("roja");
        renderizarCarta(divCarta, carta);

        divCarta.dataset.index = index;
        contenedor.appendChild(divCarta);
    }); */


     contenedor.innerHTML = '';

    mesa.forEach((carta, index) => {
        const divCarta = document.createElement('div');
        divCarta.classList.add('carta');

        if (ocultarSegunda && index === 1) {
            divCarta.classList.add('reverso');
        } else {
            if (carta.palo === '♥️' || carta.palo === '♦️') {
                divCarta.classList.add("roja");
            }
            renderizarCarta(divCarta, carta);
        }

        contenedor.appendChild(divCarta);
    });


}

const MAPA_CARTAS = {
    1: "A",
    11: "J",
    12: "Q",
    13: "K"
};

function renderizarCarta(divCarta, carta) {
    const valor = MAPA_CARTAS[carta.valor] ?? carta.valor;

    divCarta.innerHTML = `
            <div class="valor arriba">${valor}</div>
            <div class="palo">${carta.palo}</div>
            <div class="valor abajo">${valor}</div>
        `;
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
    valorApuesta.textContent = juego.apuesta;
}

btnRepetirApuesta.addEventListener('click', () => {
    if (juego.apuestaAnterior <= juego.fichasJugador) {
        juego.apuesta = juego.apuestaAnterior;
        btnBajarApuesta.disabled = false;
        actualizarApuesta();
        btnDeal.disabled = false;

        if (juego.apuestaAnterior === juego.fichasJugador) {
            btnSubirApuesta.disabled = false;
        }

    }

});



btnBajarApuesta.addEventListener('click', () => {
    if (juego.apuesta - 25 >= 0) {
        juego.apuesta -= 25;
        actualizarApuesta();
        btnSubirApuesta.disabled = false;
    }

    if (juego.apuesta === 0) {
        btnDeal.disabled = true;
        btnBajarApuesta.disabled = true;
    }

});

btnSubirApuesta.addEventListener('click', () => {
    if (juego.apuesta + 25 <= juego.fichasJugador) {
        juego.apuesta += 25;
        actualizarApuesta();
        btnBajarApuesta.disabled = false;
        btnDeal.disabled = false;
    }
    if (juego.fichasJugador - juego.apuesta === 0) {
        btnSubirApuesta.disabled = true;
    }

});

//botones de juego
const btnDeal = document.getElementById('btn-deal');
const btnHit = document.getElementById('btn-hit');
const btnStand = document.getElementById('btn-stand');
const btnDouble = document.getElementById('btn-double');

btnHit.addEventListener('click', () => {
    juego.puntajeJugador = hit(juego.mesaJugador, contenedorJugador);
    feedbackPuntajeJugador.textContent = juego.puntajeJugador;
    if (juego.puntajeJugador === "BLACKJACK" || juego.puntajeJugador === 21 || juego.puntajeJugador === "BUST") {
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
    if (juego.apuesta > 0) {


        btnDeal.disabled = true;
        btnHit.disabled = false;
        btnStand.disabled = false;
        btnDouble.disabled = false;

        btnBajarApuesta.disabled = true;
        btnSubirApuesta.disabled = true;

        juego.fichasJugador -= juego.apuesta;
        saldoJugador.textContent = juego.fichasJugador;

        juego.apuestaAnterior = juego.apuesta;

        actualizarEstado("Turno del jugador");
        hit(juego.mesaJugador, contenedorJugador);
        hit(juego.mesaJugador, contenedorJugador);
        mostrarCartas(juego.mesaJugador, contenedorJugador, false);
        juego.puntajeJugador = calcularMano(juego.mesaJugador);
        feedbackPuntajeJugador.textContent = juego.puntajeJugador;
    

        hit(juego.mesaCrupier, contenedorCrupier);
        juego.puntajeCrupier = calcularMano(juego.mesaCrupier);
        // calculamos el puntaje para la primera carta antes de agarrar la segunda
        hit(juego.mesaCrupier, contenedorCrupier);
        mostrarCartas(juego.mesaCrupier, contenedorCrupier, true);
        feedbackPuntajeCrupier.textContent = juego.puntajeCrupier;

        if (juego.puntajeJugador === "BLACKJACK") stand();

    } else {
        alert("Haz una apuesta primero");
    }
}

    btnDouble.addEventListener('click', () => {
        doubleDown();

    });

    function actualizarEstado(nuevoEstado) {
        estadoPartida.textContent = nuevoEstado;
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


//puntajes y estado
const feedbackPuntajeJugador = document.getElementById('puntos-jugador');
const feedbackPuntajeCrupier = document.getElementById('puntos-crupier');
const estadoPartida = document.getElementById('estado-partida');

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

    if (juego.fichasJugador === 0) document.getElementById("modal-derrota").classList.remove("hidden");

    juego.apuestaAnterior = juego.apuesta;
    juego.apuesta = 0;

    saldoJugador.textContent = juego.fichasJugador;

    juego.mesaCrupier.length = 0;
    juego.mesaJugador.length = 0;
    mostrarCartas(juego.mesaJugador, contenedorJugador ,false);
    mostrarCartas(juego.mesaCrupier, contenedorCrupier ,false);

    estadoPartida.textContent = "Ingrese una apuesta"
    feedbackPuntajeJugador.textContent = "---"
    feedbackPuntajeCrupier.textContent = "---"
    valorApuesta.textContent = 0;

    btnRepetirApuesta.disabled = false;
    btnBajarApuesta.disabled = true;
    btnSubirApuesta.disabled = false;

}


function iniciarJuego() {
    juego.mazo.length = 0;
    juego.mesaCrupier.length = 0;
    juego.mesaJugador.length = 0;
    juego.fichasJugador = config.fichasIniciales;
    juego.apuesta = 0;
    juego.puntuacionJuego = 0;


    btnDeal.disabled = true;
    btnHit.disabled = true;
    btnStand.disabled = true
    btnDouble.disabled = true;

    btnBajarApuesta.disabled = true;

    generarMazo(juego.mazo);

    juego.fichasJugador = config.fichasIniciales;
    saldoJugador.textContent = juego.fichasJugador;

}

iniciarJuego()





