
const TAMANO_MUNDO = 40; // Casillas por lado (40x40)
const TAM_CELDA = 15; // Píxeles que mide cada casillas
const PASOS_POR_SEGUNDO = 10; // Velocidad simulación

const canvas = document.getElementById("canvasMundo");

const btnReset = document.getElementById("btnReset");
const btnIniciar = document.getElementById("btnIniciar");
const btnDetener = document.getElementById("btnDetener");
const btnSiguienteGen = document.getElementById("btnSiguienteGen");

const mundo = new Mundo(TAMANO_MUNDO, canvas, TAM_CELDA);

let timer = null; 

//////////////////////////////// Figura de prueba (hasta que haya ratón) ////////////////////////////////

// Cada figura es una lista de posiciones [fila, columna] relativas a su esquina.

const PLANEADOR = [[0, 1], [1, 2], [2, 0], [2, 1], [2, 2]];
const PARPADEADOR = [[0,0], [0,1], [0,2]];

// Pone vivas las celulas de una figura a partir de la posición (fila, columna)
function colocarFigura(figura, fila, columna){
    for (const [desplazamientoFila, desplazamientoColumna] of figura){
        mundo.matriz[fila+ desplazamientoFila][columna + desplazamientoColumna].viva = true;
    }
}

// SIMULACIÓN

function paso(){
    mundo.siguienteTurno();
    mundo.dibujar();
}

function iniciar(){
    if (timer !== null){
        return;
    }

    timer = setInterval(paso, 1000 / PASOS_POR_SEGUNDO);
}

function detener(){
    clearInterval(timer);
    timer = null;
}

function reiniciar(){
    detener();
    for (let fila = 0; fila < TAMANO_MUNDO; fila++){
        for (let columna = 0; columna < TAMANO_MUNDO; columna++){
            mundo.matriz[fila][columna].viva = false;
        }
    }
    mundo.turnos = 0;
    colocarFigura(PLANEADOR, 2, 2);
    colocarFigura(PARPADEADOR, 20, 20);
    mundo.dibujar();
}

// Evento botones
btnReset.addEventListener("click", reiniciar);
btnIniciar.addEventListener("click", iniciar);
btnDetener.addEventListener("click", detener);
btnSiguienteGen.addEventListener("click", paso);


// Arranque
colocarFigura(PLANEADOR, 2, 2);
colocarFigura(PARPADEADOR, 20, 20);
mundo.dibujar();
