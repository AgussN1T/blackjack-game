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

    for (let i = 0; i < cartasTotales.length; i++) {

        let indexR = Math.floor(Math.random() * cartasTotales.length);
        let carta = cartasTotales.splice(indexR, 1)[0];
        mazo.push(carta);

    }
}

function hit(mesa,mazo){
    
    if(mazo.length === 0) throw console.error();
    
    mesa.push(mazo.splice(0,1)[0]);
    
}

function stand(){
    croupier();
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

function mostrarMesa(index) {
    const mesaElement = mesaElements[index];
    mesaElement.innerHTML = '';

    if (mesa[index].length === 0) return;

    const carta = mesa[index][mesa[index].length - 1];

    const divCarta = document.createElement('div');
    divCarta.classList.add('carta');

    renderizarCarta(divCarta, carta);

    mesaElement.appendChild(divCarta);
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

let puntuacionTotal = 0;

function iniciarJuego() {
    mazo.length = 0; 
    mesaCroupier.length = 0;
    mesaJugador.length = 0;
    fichasJugador = 0;
    apuesta = 0;

    generarMazo(mazo, config);

    fichasJugador = 200;

    // comenzar apuesta
    // hit(mesaJugador,mazo);
    // hit(mesaJugador,mazo);

    // hit(mesaCroupier,mazo);
    // hit(mesaCroupier,mazo);
    
    console.log("Cartas Jugador:", mesaJugador);


}

iniciarJuego()