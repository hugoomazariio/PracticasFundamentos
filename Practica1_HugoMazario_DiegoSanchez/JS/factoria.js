// Programa realizado por Hugo Mazarío Ros y Diego Sánchez Álvarez

/**
 * Clase Factoria
 * Encargada de generar piezas de forma aleatoria y llevar el recuento por tipos.
 */
class Factoria {
    constructor() {
        // Cuenta del número de piezas de cada tipo
        this.totalElectricas = 0;
        this.totalMecanicas = 0;
    }

    /**
     * Genera 10 números al azar y les pega la letra que le pasemos ('E' o 'M')
     * @param {string} letra - Letra identificativa que se añadirá al final del código.
     * @returns {string} - Código final de 10 dígitos seguido de la letra.
     */
    generarCodigo(letra) {
        let codigoFinal = "";
        for (let i = 0; i < 10; i++) {
            // Math.floor le quita los decimales para dejar un entero del 0 al 9
            let numeroAzar = Math.floor(Math.random() * 10);
            codigoFinal = codigoFinal + numeroAzar;
        }
        return codigoFinal + letra;
    }

    /**
     * Elige un elemento al azar de una lista
     * @param {Array} lista - Vector con los elementos disponibles.
     * @returns {*} - Elemento aleatorio de la lista.
     */
    obtenerAleatorio(lista) {
        let indiceAzar = Math.floor(Math.random() * lista.length);
        return lista[indiceAzar];
    }

    /**
     * Crea una pieza nueva, eligiendo al azar si es eléctrica o mecánica y 
     * rellenando sus atributos con valores aleatorios.
     * @returns {PiezaElectrica | PiezaMecanica} - Objeto de la pieza generada.
     */
    generarPieza() {
        let fechaActual = new Date();
        
        // Menor que 0.3 (30% de las veces), genera PiezaElec
        if (Math.random() < 0.3) {
            // Elegir características al azar
            let nombre = this.obtenerAleatorio(PiezaElectrica.NOMBRES);
            let potencia = this.obtenerAleatorio(PiezaElectrica.POTENCIAS);
            let voltaje = this.obtenerAleatorio(PiezaElectrica.VOLTAJES);
            
            // Genera el codigo con la letra E y le añade 1 al contador
            let codigo = this.generarCodigo('E');
            this.totalElectricas++;

            // Crea y devuelve la pieza usando el constructor PiezaElec
            return new PiezaElectrica(nombre, codigo, fechaActual, potencia, voltaje);
            
        } else { // Mayor o igual que 0.3 (70% de las veces), genera PiezaMec

            // Elegir características al azar
            let nombre = this.obtenerAleatorio(PiezaMecanica.NOMBRES);
            let material = this.obtenerAleatorio(PiezaMecanica.MATERIALES);
            
            // Genera el codigo con la letra M y le añade 1 al contador
            let codigo = this.generarCodigo('M');
            this.totalMecanicas++;

            // Crea y devuelve la pieza usando el constructor PiezaMec
            return new PiezaMecanica(nombre, codigo, fechaActual, material);
        }
    }
}