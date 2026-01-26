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

function hit(mesa,contenedor,mazo){
    
    if(mazo.length === 0) throw console.error();
    
    mesa.push(mazo.splice(0,1)[0]);
    
    mostrarCartas(mesa,contenedor);
    
}

function stand(){
    // croupier();
    return;
}

function doubleDown(){

    if(fichasJugador>=apuesta){
        fichasJugador -= apuesta;
        apuesta = apuesta*2;
        hit(mesaJugador,mazo)
    }
    else{
        console.log('No tienes suficientes fichas');
    }
    return;
}

function mostrarCartas(mesa, contenedor) {
    contenedor.innerHTML = '';

    mesa.forEach((carta, index) => {
        const divCarta = document.createElement('div');
        
        divCarta.style.left = `${index * 30}px`;
        divCarta.style.zIndex = index;

        divCarta.classList.add('carta');
        if(carta.palo === '♥️' || carta.palo === '♦️') divCarta.classList.add("roja");
        renderizarCarta(divCarta,carta);

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
    
    if(carta.valor <=10){
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

let estado = "esperando";

let puntuacionTotal = 0;

const contenedorCrupier = document.getElementById('contenedor-cartas-crupier');
const contenedorJugador = document.getElementById('contenedor-cartas-jugador');
const btnHit = document.getElementById('btn-hit');
const btnDeal = document.getElementById('btn-deal');
const btnStand = document.getElementById('btn-stand');

btnHit.addEventListener('click', () => {
    hit(mesaJugador,contenedorJugador, mazo);
});

btnDeal.addEventListener('click', () => {
    hit(mesaJugador,contenedorJugador,mazo);
    hit(mesaJugador,contenedorJugador,mazo);

    hit(mesaCroupier,contenedorCrupier,mazo);
    hit(mesaCroupier,contenedorCrupier,mazo);

    btnDeal.disabled = true;
    btnHit.disabled = false;
    btnStand.disabled= false;
});



function iniciarJuego() {
    mazo.length = 0; 
    mesaCroupier.length = 0;
    mesaJugador.length = 0;
    fichasJugador = 0;
    apuesta = 0;

    btnHit.disabled = true;
    btnStand.disabled= true

    generarMazo(mazo, config);

    fichasJugador = 200;

    console.log("Cartas Jugador:", mesaJugador);
    console.log("Cartas Crupier:", mesaCroupier);


}

iniciarJuego()



