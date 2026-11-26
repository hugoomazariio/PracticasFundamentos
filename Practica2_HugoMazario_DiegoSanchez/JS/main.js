// main.js
// Autores: Hugo Mazarío Ros y Diego Sánchez Álvarez

// Punto de entrada del programa: crea el mundo, define las figuras
// predefinidas, controla la simulación (temporizador) y gestiona
// los botones y el ratón.


///////////////////// CONSTANTES /////////////////////
// Para cambiar el tamaño o la velocidad del juego solo hay que modificar estos valores.

const TAMANO_MUNDO = 40; // Casillas por lado (el mundo es de 40 x 40).
const TAM_CELDA = 15; // Píxeles que mide cada casilla.
const PASOS_POR_SEGUNDO = 10; // Velocidad de la simulación.

////////////////// ELEMENTOS DEL HMTL //////////////////

const canvas = document.getElementById("canvasMundo");

const btnReset = document.getElementById("btnReset");
const btnIniciar = document.getElementById("btnIniciar");
const btnDetener = document.getElementById("btnDetener");
const btnSiguienteGen = document.getElementById("btnSiguienteGen");
const btnCuadricula = document.getElementById("btnCuadricula");

// Lista con todos los botones del panel de figuras.
const botonesFigura = document.querySelectorAll(".btn-figura");

//////////////////////////////// Estado del programa ////////////////////////////////

// El mundo (matriz de células + dibujo + lógica del juego).
const mundo = new Mundo(TAMANO_MUNDO, canvas, TAM_CELDA);

// Temporizador de la simulación. null significa "simulación detenida".
let timer = null;

// HErramienta elegida en el panel: "celula" o la clave de una figura de FIGURAS.
let figuraSeleccionada = "celula";

//////////////////////////////// FIGURAS PREESTABLECIDAS ////////////////////////////////

// Cada figura es una lista de posiciones [fila, columna] relativas a la 
// casilla pulsada (que actúa como esquina superior izquierda de la figura).
// Las claves coinciden con el atributo data-figura de los botones del HTML.

const FIGURAS = {
    // Vidas estáticas: no cambian con el paso del tiempo.
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
    // Osciladores: repiten una secuencia de formas.
    intermitente: [
        [0, 0], [0, 1], [0, 2]
    ],
    sapo: [
        [0, 1], [0, 2], [0, 3],
        [1, 0], [1, 1], [1, 2]
    ],
    // Naves espaciales: se desplazan por el mundo
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

/**
 * Pone vivas las células de una figura, tomando (fila, columna) como
 * esquina superior izquierda. Si la figura se sale por un borde, 
 * continúa por el lado opuesto (mundo infinito).
 * @param {Array} figura - Lista de posiciones [fila, columna] relativas.
 * @param {number} fila - Fila donde se coloca la figura.
 * @param {number} columna - Columna donde se coloca la figura.
 */
function colocarFigura(figura, fila, columna) {
    for (const [desplazamientoFila, desplazamientoColumna] of figura) {

        // El módulo hace que las posiciones que se salen del mundo den la cuelta
        const f = (fila + desplazamientoFila + TAMANO_MUNDO) % TAMANO_MUNDO;
        const c = (columna + desplazamientoColumna + TAMANO_MUNDO) % TAMANO_MUNDO;
        mundo.matriz[f][c].viva = true;
        mundo.matriz[f][c].tiempo = 0; // Acaba de aparecer: lleva 0 pasos viva.
    }
}


//////////////////////////////// SIMULACIÓN ////////////////////////////////

// Párrafo donde se muestra el estado de la simulación y el número de paso
const infoPasos = document.getElementById("infoPasos");

/**
 * Actualiza el texto con el estado de la simulación (en marcha o detenida)
 * y el número de paso. Si hay un temporizador activo, está en marcha.
 */
function actualizarInfoPasos(){
    
    // Información de los pasos
    const estado = (timer !== null) ? "en marcha" : "detenida";
    infoPasos.textContent = "Simulación " + estado + ": paso " + mundo.turnos;
}

/**
 * Avanza la simulación un paso: calcula el turno siguiente, 
 * redibuja el mundo y actualiza la información de pantalla.
 * Se ejecuta cada vez que salta el temporizador y también 
 * con el botón "Siguiente generación".
 */
function paso() {
    mundo.siguienteTurno();
    mundo.dibujar();
    actualizarInfoPasos();

}

/**
 * Pone en marcha la simulación. ejecuta paso() periódicamente.
 */
function iniciar() {
    // Si ya está en marcha no creamos otro temporizador; si no, se
    // acumularían y la simulación iría cada vez más rápido.
    if (timer !== null) {
        return;
    }
    // setInterval ejecuta paso() cada X milisegundos:
    // 1000 ms / 10 pasos por segundo = 100 ms entre pasos.
    timer = setInterval(paso, 1000 / PASOS_POR_SEGUNDO);
    actualizarInfoPasos();
}

/**
 * Detiene la simulación. El mundo se queda tal como está, y se puede reanudar con "Jugar".
 */
function detener() {
    clearInterval(timer); // Marcamos que ya no hay temporizafor activo.
    timer = null;
}

/**
 * Detiene la simulación, mata todas las células, pone el contador de pasos 
 * a 0 y vuelve a colocar las figuras iniciales (planeador e intermitente).
 */
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
    actualizarInfoPasos(); // Para que muestre "paso 0"
}

/**
 * Muestra u oculta la cuadrícula y actualiza el texto del botón según el nuevo estado.
 */
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
    if (evento.button === 0) {
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

// Información de la célula

const infoCelula = document.getElementById("infoCelula");


canvas.addEventListener("mousemove", function (evento) {
    // Posición del ratón
    const rect = canvas.getBoundingClientRect();
    const x = evento.clientX - rect.left;
    const y = evento.clientY - rect.top;

    const columna = Math.floor(x / TAM_CELDA);
    const fila = Math.floor(y / TAM_CELDA);

    // Solo si la casilla existe

    if (fila >= 0 && fila < TAMANO_MUNDO && columna >= 0 && columna < TAMANO_MUNDO) {
        const celula = mundo.matriz[fila][columna];
        const estado = celula.viva ? "viva" : "muerta";
        infoCelula.textContent = "Célula (" + fila + ", " + columna + "): " +
            estado + " desde hace " + celula.tiempo + " pasos";
    }
});

canvas.addEventListener("mouseleave", function (evento) {
    infoCelula.textContent = "Pasa el ratón sobre una célula";
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