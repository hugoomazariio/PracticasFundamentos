// Celula.js
// Autores: Hugo Mazarío Ros y Diego Sánchez Álvarez

/**
 * Modela una célula del juego de la visa.
 * Cada célula está viva o muerta y recuerda cuántos turnos lleva
 * en su estado actual (sirve tanto para "viva desde hace X" como 
 * para "muerta desde hace X").
 */
class Celula {

    constructor() {

        // Estado de la célula: true = viva, false = muerta
        // Todas las células empiezan muertas
        this.viva = false;

        //Número de turnos que lleva la célula en su estado actual.
        // Se reinicia a 0 cada vez que cambia su estado.
        this.tiempo = 0;
    }

    /**
     * Cambia el estado de la célula (viva <-> muerta)
     * Se usa cuando el usuario hace clic sobre ella con el ratón.
     * Al cambiar de estado, el contador de tiempo vuelve a empezar.
     */
    alternar() {
        this.viva = !this.viva;
        this.tiempo = 0;
    }

    /**
     * Aplica el estado que le corresponde a la célula en el turno siguiente.
     * Si el estado no cambia, suma un turno al contador; si cambia,
     * guarda el nuevo estado y reinicia el contador.
     * @param {boolean} nuevoEstado - true si la celula estará viva, false si muerta.
     */
    actualizar(nuevoEstado) {
        if (nuevoEstado === this.viva) {
            // Sigue igual: lleva un turno más en este estado.
            this.tiempo++;
        } else {
            // Ha cambiado: nuevo estado y el contador empieza de cero.
            this.viva = nuevoEstado;
            this.tiempo = 0;
        }
    }
}