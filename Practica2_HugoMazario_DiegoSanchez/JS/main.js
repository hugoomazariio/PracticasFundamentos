// main.js
// Autores: Hugo Mazarío Ros y Diego Sánchez Álvarez

// Crea el mundo, define las figuras predefinidas, 
// controla la simulación (temporizador) y gestiona 
// los botones y el ratón.


// CONSTANTES 
// Para cambiar el tamaño o la velocidad del juego solo hay que modificar estos valores.

const TAMANO_MUNDO = 40; // Casillas por lado (el mundo es de 40 x 40).
const TAM_CELDA = 15; // Píxeles que mide cada casilla.
const PASOS_POR_SEGUNDO = 10; // Velocidad de la simulación.

// Niveles de zoom (número de casillas por lado). El canvas siempre mide lo mismo 
// en pízeles (40 x 15 = 600), así que con más casillas cada una es más pequeña.
// Todos los valores dividen exactamente 600 para que las casillas midan píxeles enteros.
const NIVELES_ZOOM = [20, 30, 40, 50, 60, 75, 100];



// ELEMENTOS DEL HTML 

const canvas = document.getElementById("canvasMundo");

const btnReset = document.getElementById("btnReset");
const btnIniciar = document.getElementById("btnIniciar");
const btnDetener = document.getElementById("btnDetener");
const btnAnteriorGen = document.getElementById("btnAnteriorGen");
const btnSiguienteGen = document.getElementById("btnSiguienteGen");
const btnCuadricula = document.getElementById("btnCuadricula");
const btnZoomMas = document.getElementById("btnZoomMas");
const btnZoomMenos = document.getElementById("btnZoomMenos");

// Botones del panel de figuras.
const botonesFigura = document.querySelectorAll(".btn-figura");

// Estado del programa 

// El mundo (matriz de células + dibujo + lógica del juego).
const mundo = new Mundo(TAMANO_MUNDO, canvas, TAM_CELDA);

// Temporizador de la simulación. null significa "simulación detenida".
let timer = null;

// Nivel de zoom con el que empieza el juego
const NIVEL_ZOOM_INICIAL = NIVELES_ZOOM.indexOf(TAMANO_MUNDO);

// Posición actual en NIVELES_ZOOM
let nivelZoom = NIVELES_ZOOM.indexOf(TAMANO_MUNDO);

// Herramienta elegida en el panel: "celula" o la clave de una figura de FIGURAS.
let figuraSeleccionada = "celula";

// FIGURAS PREESTABLECIDAS 

// Cada figura es una lista de posiciones relativas a la 
// casilla pulsada (que actúa como esquina superior izquierda de la figura).

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

        // El módulo hace que las posiciones que se salen del mundo den la vuelta
        const f = (fila + desplazamientoFila + TAMANO_MUNDO) % TAMANO_MUNDO;
        const c = (columna + desplazamientoColumna + TAMANO_MUNDO) % TAMANO_MUNDO;
        mundo.matriz[f][c].viva = true;
        mundo.matriz[f][c].tiempo = 0; // Acaba de aparecer: lleva 0 pasos viva.
    }
}


// SIMULACIÓN 

// Párrafo donde se muestra el estado de la simulación y el número de paso
const infoPasos = document.getElementById("infoPasos");

/**
 * Actualiza el texto con el estado de la simulación (en marcha o detenida)
 * y el número de paso. Si hay un temporizador activo, está en marcha.
 */
function actualizarInfoPasos() {

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
    actualizarInfoCelula();
    actualizarBotonAnterior();
}

/**
 * Activa el botón "Generación anterior" solo si hay un turno al que volver.
 */
function actualizarBotonAnterior(){
    btnAnteriorGen.disabled = !mundo.hayHistorial();
}

function anterior(){
    detener();
    mundo.anteriorTurno();
    mundo.dibujar();
    actualizarInfoPasos();
    actualizarInfoCelula();
    actualizarBotonAnterior();
}

/**
 * Pone en marcha la simulación. ejecuta paso() periódicamente.
 */
function iniciar() {
    // Si ya está en marcha no creamos otro temporizador.
    // Si no, se acumularían y la simulación iría cada vez más rápido.
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
    clearInterval(timer);
    timer = null; // Marcamos que ya no hay temporizador activo.
    actualizarInfoPasos();
}

/**
 * Detiene la simulación, mata todas las células, pone el contador de pasos 
 * a 0 y vuelve a colocar las figuras iniciales (planeador e intermitente).
 */
function reiniciar() {
    detener();
    establecerZoom(NIVEL_ZOOM_INICIAL);
    mundo.limpiar();
    mundo.colocarFigura(FIGURAS.planeador, 2, 2);
    mundo.colocarFigura(FIGURAS.intermitente, 20, 20);
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


// ZOOM

/**
 * Aplica un nivel de zoom: cambia el número de casillas del mundo
 * y actualiza la información de pantalla.
 * @param {number} nuevoNivel - Posicion en NIVELES_ZOOM.
 */
function establecerZoom(nuevoNivel) {
    nivelZoom = nuevoNivel;
    mundo.cambiarTamanio(NIVELES_ZOOM[nivelZoom]);
    casillaRaton = null;
    actualizarInfoCelula();
    actualizarBotonesZoom();
    actualizarBotonAnterior();
}

/**
* Acerca la vista. Menos casillas, más grandes. No hace nada si ya está en el máximo.
*/
function acercar() {
    if (nivelZoom > 0) {
        establecerZoom(nivelZoom - 1);
    }
}


/**
 * Aleja la vista. Más casillas, más pequeñas, no hace nada si ya está en el mínimo
 */

function alejar() {
    if (nivelZoom < NIVELES_ZOOM.length - 1) {
        establecerZoom(nivelZoom + 1);
    }
}
/**
 * Desactiva cada botón de zoom solo cuando se ha llegado a su límite:
 * Zoom + en el nivel con menos casillas, Zoom - en el nivel con más casillas.
 * En cualquier otro nivel, los dos botones están activos.
 */
function actualizarBotonesZoom() {
    btnZoomMas.disabled = (nivelZoom === 0);
    btnZoomMenos.disabled = (nivelZoom === NIVELES_ZOOM.length - 1);
}

// SELECCIÓN DE FIGURA 

// Al pulsar un botón del panel, se marca como activo y se guarda su clave como herramienta elegida.
botonesFigura.forEach((boton) => {
    boton.addEventListener("click", () => {
        botonesFigura.forEach((b) => b.classList.remove("activo"));
        boton.classList.add("activo");
        figuraSeleccionada = boton.dataset.figura;
    });
});

// INTERACCIÓN CON EL RATÓN

/**
 * Convierte la posición de un evento del ratón en la casilla del mundo sobre la que está.
 * @param {MouseEvent} evento 
 * @returns {{fila: number, columna: number} | null } La casilla o null si el ratón está fuera.
 */
function obtenerCasilla(evento) {

    const rect = canvas.getBoundingClientRect();
    const x = evento.clientX - rect.left - canvas.clientLeft;
    const y = evento.clientY - rect.top - canvas.clientTop; // Al restar la posición del canvas queda relativo a su esquina.

    // De píxeles a casilla
    const columna = Math.floor(x / mundo.tamanioCelda);
    const fila = Math.floor(y / mundo.tamanioCelda);

    if (fila >= 0 && fila < mundo.casillasPorLado && columna >= 0 && columna < mundo.casillasPorLado) {
        return { fila: fila, columna: columna };
    }
    return null;

}

// Al hacer clic izquierdo sobre el mundo pone o quita una célula o coloca una figura.
// Funciona en cualquier momento, también con la simulación en marcha.

canvas.addEventListener("mousedown", function (evento) {
    const casilla = obtenerCasilla(evento);

    if (evento.button === 0 && casilla !== null) {
        if (figuraSeleccionada === "celula") {
            // Alterna entre viva y muerta.
            mundo.matriz[casilla.fila][casilla.columna].alternar();
        } else if (FIGURAS[figuraSeleccionada]) {
            // La coloca con la casilla como esquina.
            mundo.colocarFigura(FIGURAS[figuraSeleccionada], casilla.fila, casilla.columna);
        }
        mundo.dibujar();
        actualizarInfoCelula();
    }
});

// INFORMACIÓN DE LA CELULA

// Mostramos la información de la célula bajo el ratón
const infoCelula = document.getElementById("infoCelula");

let casillaRaton = null; // Nos sirve para poder refrescar el texto en cada paso de la simulación.

/**
 * Escribe cuánto tiempo lleva la célula bajo el ratón en su estado actual.
 */
function actualizarInfoCelula() {
    if (casillaRaton === null) {
        infoCelula.textContent = "Pasa el ratón sobre una célula";
        return;
    }
    const celula = mundo.matriz[casillaRaton.fila][casillaRaton.columna];
    const estado = celula.viva ? "viva" : "muerta";
    infoCelula.textContent = "Célula (" + casillaRaton.fila + ", " + casillaRaton.columna + "): " +
        estado + " desde hace " + celula.tiempo + " pasos";

}

// Al mover el ratón por el canvas, guardamos la casilla y actualizamos el texto.
canvas.addEventListener("mousemove", function (evento) {
    casillaRaton = obtenerCasilla(evento);
    actualizarInfoCelula();
});

canvas.addEventListener("mouseleave", function (evento) {
    casillaRaton = null;
    actualizarInfoCelula();
});


// EVENTO DE LOS BOTONES

btnReset.addEventListener("click", reiniciar);
btnIniciar.addEventListener("click", iniciar);
btnDetener.addEventListener("click", detener);
btnAnteriorGen.addEventListener("click", anterior);
btnSiguienteGen.addEventListener("click", paso);
btnCuadricula.addEventListener("click", alternarCuadricula);
btnZoomMas.addEventListener("click", acercar);
btnZoomMenos.addEventListener("click", alejar);


// ARRANQUE

// El estado inicial es un planeador y un intermitente para ver algo al abrir la página
mundo.colocarFigura(FIGURAS.planeador, 2, 2);
mundo.colocarFigura(FIGURAS.intermitente, 20, 20);
mundo.dibujar();
actualizarBotonesZoom();
actualizarBotonAnterior();