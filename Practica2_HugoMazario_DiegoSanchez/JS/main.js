const TAMANO_MUNDO = 40; // Casillas por lado (40x40)
const TAM_CELDA = 15; // Píxeles que mide cada casilla
const PASOS_POR_SEGUNDO = 10; // Velocidad simulación

const canvas = document.getElementById("canvasMundo");

const btnReset = document.getElementById("btnReset");
const btnIniciar = document.getElementById("btnIniciar");
const btnDetener = document.getElementById("btnDetener");
const btnSiguienteGen = document.getElementById("btnSiguienteGen");
const btnCuadricula = document.getElementById("btnCuadricula");
const botonesFigura = document.querySelectorAll(".btn-figura");

const mundo = new Mundo(TAMANO_MUNDO, canvas, TAM_CELDA);

let timer = null;
let figuraSeleccionada = "celula";

//////////////////////////////// Figuras preestablecidas ////////////////////////////////

// Cada figura es una lista de posiciones [fila, columna] relativas a la casilla pulsada
const FIGURAS = {
    bote: [
        [0, 0], [0, 1],
        [1, 0], [1, 2],
        [2, 1]
    ],
    pan: [
        [0, 1], [0, 2],
        [1, 0], [1, 3],
        [2, 1], [2, 3],
        [3, 2]
    ],
    intermitente: [
        [0, 0], [0, 1], [0, 2]
    ],
    sapo: [
        [0, 1], [0, 2], [0, 3],
        [1, 0], [1, 1], [1, 2]
    ],
    planeador: [
        [0, 1],
        [1, 2],
        [2, 0], [2, 1], [2, 2]
    ],
    navePesada: [
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
        [1, 0], [1, 6],
        [2, 6],
        [3, 0], [3, 5],
        [4, 2], [4, 3]
    ]
};

// Pone vivas las células de una figura a partir de la posición (fila, columna)
function colocarFigura(figura, fila, columna) {
    for (const [desplazamientoFila, desplazamientoColumna] of figura) {
        const f = (fila + desplazamientoFila + TAMANO_MUNDO) % TAMANO_MUNDO;
        const c = (columna + desplazamientoColumna + TAMANO_MUNDO) % TAMANO_MUNDO;
        mundo.matriz[f][c].viva = true;
        mundo.matriz[f][c].tiempo = 0;
    }
}

// SIMULACIÓN

function paso() {
    mundo.siguienteTurno();
    mundo.dibujar();
}

function iniciar() {
    if (timer !== null) {
        return;
    }
    timer = setInterval(paso, 1000 / PASOS_POR_SEGUNDO);
}

function detener() {
    clearInterval(timer);
    timer = null;
}

function reiniciar() {
    detener();
    for (let fila = 0; fila < TAMANO_MUNDO; fila++) {
        for (let columna = 0; columna < TAMANO_MUNDO; columna++) {
            mundo.matriz[fila][columna].viva = false;
            mundo.matriz[fila][columna].tiempo = 0;
        }
    }
    mundo.turnos = 0;
    colocarFigura(FIGURAS.planeador, 2, 2);
    colocarFigura(FIGURAS.intermitente, 20, 20);
    mundo.dibujar();
}

function alternarCuadricula() {
    mundo.alternarCuadricula();
    btnCuadricula.textContent = mundo.mostrarCuadricula ? "Ocultar cuadrícula" : "Mostrar cuadrícula";
}

// Selección de figura
botonesFigura.forEach((boton) => {
    boton.addEventListener("click", () => {
        botonesFigura.forEach((b) => b.classList.remove("activo"));
        boton.classList.add("activo");
        figuraSeleccionada = boton.dataset.figura;
    });
});

// Interacción con el ratón (clic izquierdo solo cuando está detenido)
canvas.addEventListener("mousedown", function (evento) {
    if (evento.button === 0 && timer === null) {
        const rect = canvas.getBoundingClientRect();
        const x = evento.clientX - rect.left;
        const y = evento.clientY - rect.top;

        const columna = Math.floor(x / TAM_CELDA);
        const fila = Math.floor(y / TAM_CELDA);

        if (fila >= 0 && fila < TAMANO_MUNDO && columna >= 0 && columna < TAMANO_MUNDO) {
            if (figuraSeleccionada === "celula") {
                mundo.matriz[fila][columna].alternar();
            } else if (FIGURAS[figuraSeleccionada]) {
                colocarFigura(FIGURAS[figuraSeleccionada], fila, columna);
            }
            mundo.dibujar();
        }
    }
});

// Evento botones
btnReset.addEventListener("click", reiniciar);
btnIniciar.addEventListener("click", iniciar);
btnDetener.addEventListener("click", detener);
btnSiguienteGen.addEventListener("click", paso);
btnCuadricula.addEventListener("click", alternarCuadricula);

// Arranque
colocarFigura(FIGURAS.planeador, 2, 2);
colocarFigura(FIGURAS.intermitente, 20, 20);
mundo.dibujar();