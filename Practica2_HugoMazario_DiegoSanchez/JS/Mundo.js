// Mundo.js
// Autores: Hugo Mazarío Ros y Diego Sánchez Álvarez

/**
 * Modela el mundo del juego de la vida: una matriz cuadrada de células
 * que se dibuja en un canvas y que sabe calculas su propia evolución. 
 * El mundo es "infinito": el borde superior continúa en el inferior
 * y el izquierdo en el derecho.
 */
class Mundo {

    /**
     * 
     * @param {number} casillasPorLado - Celulas por lado (el mundo es de N x N).
     * @param {HTMLCanvasElement} canvas - Canvas donde se dibuja el mundo. 
     * @param {number} tamanioCelda - Píxeles que mide cada casillas.
     */
    constructor(casillasPorLado, canvas, tamanioCelda) {

        this.casillasPorLado = casillasPorLado;
        this.tamanioCelda = tamanioCelda;

        // El tamaño del canvas en píxeles se calcula a partir del número de 
        // casillas, así al cambiar el tamaño del mundo no hay que tocar el HTML.
        this.canvas = canvas;
        this.canvas.width = casillasPorLado * tamanioCelda;
        this.canvas.height = casillasPorLado * tamanioCelda;

        // Contexto 2D: el "pincel" con el que se dibuja el canvas.
        this.contexto = canvas.getContext("2d");

        // Matriz bidimensional de N x N células
        // this.matriz[fila][columna] es la célula de esa posición.
        this.matriz = [];
        for (let fila = 0; fila < casillasPorLado; fila++) {
            this.matriz[fila] = [];
            for (let columna = 0; columna < casillasPorLado; columna++) {
                this.matriz[fila][columna] = new Celula();
            }
        }

        // Número de turnos (pasos) que se han simulado desde el inicio
        this.turnos = 0;
        this.mostrarCuadricula = true; // Controla si se dibuja la cuadrícula
    }

    /**
     * Muestra u oculta la cuadrícula y redibuja el mundo
     * para que el cambio se vea al instante.
     */
    alternarCuadricula() {
        this.mostrarCuadricula = !this.mostrarCuadricula;
        this.dibujar();
    }

    /**
     * Mata todas las células, reinicia sus contadores de tiempo y pone
     * a 0 el número de turnos.
     */
    limpiar() {
        for (let fila = 0; fila < this.casillasPorLado; fila++) {
            for (let columna = 0; columna < this.casillasPorLado; columna++) {
                this.matriz[fila][columna].viva = false;
                this.matriz[fila][columna].tiempo = 0;

            }
        }
        this.turnos = 0;
    }

    /**
     * Pone vivas las células de una figura, tomando (fila, columna) como
     * esquina superior izquierda. Si la figura se sale por un borde, 
     * continúa por el lado opuesto (mundo infinito).
     * @param {Array} figura - Lista de posiciones [fila, columna] relativas.
     * @param {number} fila - Fila donde se coloca la figura.
     * @param {number} columna - Columna donde se coloca la figura.
     */
    colocarFigura(figura, fila, columna) {
        for (const [desplazamientoFila, desplazamientoColumna] of figura) {

            // El módulo hace que las posiciones que se salen del mundo den la vuelta
            const f = (fila + desplazamientoFila + this.casillasPorLado) % this.casillasPorLado;
            const c = (columna + desplazamientoColumna + this.casillasPorLado) % this.casillasPorLado;
            mundo.matriz[f][c].viva = true;
            mundo.matriz[f][c].tiempo = 0; // Acaba de aparecer: lleva 0 pasos viva.
        }
    }
    /**
     * Borra el canvas y dibuja todas las células del mundo:
     * verde si están vivas y gris oscuro si están muertas.
     */
    dibujar() {
        const contexto = this.contexto; // "Pincel" del canvas.
        const tamanioCelda = this.tamanioCelda;

        // Borramos lo pintado en el turno anterior.
        contexto.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Recorremos la matriz: primero cada fila y, dentro, cada columna.
        for (let fila = 0; fila < this.casillasPorLado; fila++) {
            for (let columna = 0; columna < this.casillasPorLado; columna++) {

                // El color depende del estado de la célula.
                if (this.matriz[fila][columna].viva) {
                    contexto.fillStyle = "#4cd964";
                } else {
                    contexto.fillStyle = "#222222";
                }

                // Pintamos el cuadrado de la casillas. La posicón x depende 
                // de la columna y la y de la fila.
                contexto.fillRect(columna * tamanioCelda, fila * tamanioCelda, tamanioCelda, tamanioCelda);

                // Borde de la casilla (solo si la cuadricula está activada)
                if (this.mostrarCuadricula) {
                    contexto.strokeStyle = "#444444";
                    contexto.strokeRect(columna * tamanioCelda, fila * tamanioCelda, tamanioCelda, tamanioCelda);
                }
            }
        }
    }

    /**
     * Cuenta cuantas de las 8 células vecinas de (fila, columna) están vivas.
     * El mundo es "infinito": las casillas del borde tienen como vecinas
     * las del borde opuesto.
     * @param {number} fila 
     * @param {number} columna 
     * @returns {number} Número de vecinas vivas (de 0 a 8).
     */
    contarVecinasVivas(fila, columna) {
        let vivas = 0;

        // Los desplazamientos -1, 0 y +1 en filas y columnas recorren el 
        // cuadrado de 3x3 casillas que rodea a la célula.
        for (let desplazamientoFilas = -1; desplazamientoFilas <= 1; desplazamientoFilas++) {
            for (let desplazamientoColumnas = -1; desplazamientoColumnas <= 1; desplazamientoColumnas++) {

                // El desplazamiento (0, 0) es la propia célula:no es vecina de sí misma
                if (desplazamientoFilas === 0 && desplazamientoColumnas === 0) {
                    continue; // Salta a la siguiente vuelta del bucle
                }

                // Mundo infinito: el modulo (%) hace que la posición "de la vuelta"
                // al llegar al borde. Se suma casillasPorLado antes del módulo porque
                // en JavaScript un resultado negativo (-1 % 40) daría -1 en vez de 39.
                const f = (fila + desplazamientoFilas + this.casillasPorLado) % this.casillasPorLado;
                const c = (columna + desplazamientoColumnas + this.casillasPorLado) % this.casillasPorLado;

                if (this.matriz[f][c].viva) {
                    vivas++;
                }
            }
        }
        return vivas;
    }

    /**
     * Avanza el mundo un turno aplicando las reglas del juego de la vida.
     * Todas las células se actualizan a la vez, por eso se hace en dos pasos:
     * primero se calcula el estado de todas y después se aplica.
     * Si se cambiara cada célula nada más calcularla, las siguientes contarían
     * vecinas que ya han cambiado en este mismo turno.
     */
    siguienteTurno() {
        // Calculamos el estado que tendrá cada célula en el turno siguiente.
        const siguiente = [];

        for (let fila = 0; fila < this.casillasPorLado; fila++) {
            siguiente[fila] = [];
            for (let columna = 0; columna < this.casillasPorLado; columna++) {

                const vecinas = this.contarVecinasVivas(fila, columna);
                const estaViva = this.matriz[fila][columna].viva;

                if (!estaViva && vecinas === 3) {
                    // Muerta con exactamente 3 vecinas vivas: nace.
                    siguiente[fila][columna] = true;
                } else if (estaViva && (vecinas === 2 || vecinas === 3)) {
                    // Viva con 2 o 3 vecinas vivas: sigue viva.
                    siguiente[fila][columna] = true;
                } else {
                    // Resto de casos: muere o sigue muerta
                    // (soledad con menos de 2 vecinas, superpoblación con más de 3).
                    siguiente[fila][columna] = false;
                }
            }
        }

        // Aplicar los nuevos estados a las células
        for (let fila = 0; fila < this.casillasPorLado; fila++) {
            for (let columna = 0; columna < this.casillasPorLado; columna++) {
                this.matriz[fila][columna].actualizar(siguiente[fila][columna]);
            }
        }

        // Un turno más simulado.
        this.turnos++;
    }
}