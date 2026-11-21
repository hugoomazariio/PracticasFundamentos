class Mundo {

    constructor(casillasPorLado, canvas, tamanioCelda) {

        this.casillasPorLado = casillasPorLado;
        this.tamanioCelda = tamanioCelda;

        this.canvas = canvas;
        this.canvas.width = casillasPorLado * tamanioCelda;
        this.canvas.height = casillasPorLado * tamanioCelda;

        this.contexto = canvas.getContext("2d");

        // Matriz 
        this.matriz = [];
        for (let fila = 0; fila < casillasPorLado; fila++) {
            this.matriz[fila] = [];
            for (let columna = 0; columna < casillasPorLado; columna++) {
                this.matriz[fila][columna] = new Celula();
            }
        }

        this.turnos = 0;
        this.enEjecucion = false;
    }


    // Dibujo en pantalla

    dibujar() {
        const contexto = this.contexto; // "Pincel" del canvas
        const tamanioCelda = this.tamanioCelda;

        // Borrar lo pintado antes
        contexto.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // for de filas
        for (let fila = 0; fila < this.casillasPorLado; fila++) {
            for (let columna = 0; columna < this.casillasPorLado; columna++) {

                if (this.matriz[fila][columna].viva) {
                    contexto.fillStyle = "#4cd964";
                } else {
                    contexto.fillStyle = "#222222";
                }

                // pintar un cuadrado
                contexto.fillRect(columna * tamanioCelda, fila * tamanioCelda, tamanioCelda, tamanioCelda);

                // Borde de la casilla
                contexto.strokeStyle = "#444444";
                contexto.strokeRect(columna * tamanioCelda, fila * tamanioCelda, tamanioCelda, tamanioCelda);
            }
        }
    }

    ////////////////////////////////////// Interacciones con el ratón /////////////////////////////////////

    // Lógica del juego

    contarVecinasVivas(fila, columna) {
        let vivas = 0;

        for (let desplazamientoFilas = -1; desplazamientoFilas <= 1; desplazamientoFilas++) {
            for (let desplazamientoColumnas = -1; desplazamientoColumnas <= 1; desplazamientoColumnas++) {

                if (desplazamientoFilas === 0 && desplazamientoColumnas === 0) {
                    continue; // Salta a la siguiente vuelta del bucle
                }

                const f = (fila + desplazamientoFilas + this.casillasPorLado) % this.casillasPorLado;
                const c = (columna + desplazamientoColumnas + this.casillasPorLado) % this.casillasPorLado;

                if (this.matriz[f][c].viva) {
                    vivas++;
                }
            }
        }
        return vivas;
    }

    siguienteTurno() {
        // Calculamos el estado que tendrá cada célula en el turno siguiente

        const siguiente = [];


        for (let fila = 0; fila < this.casillasPorLado; fila++) {
            siguiente[fila] = [];
            for (let columna = 0; columna < this.casillasPorLado; columna++) {

                const vecinas = this.contarVecinasVivas(fila, columna);
                const estaViva = this.matriz[fila][columna].viva;

                if (!estaViva && vecinas === 3) {
                    siguiente[fila][columna] = true;

                } else if (estaViva && (vecinas === 2 || vecinas === 3)) {
                    siguiente[fila][columna] = true;

                } else {
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

        this.turnos++;
    }
}