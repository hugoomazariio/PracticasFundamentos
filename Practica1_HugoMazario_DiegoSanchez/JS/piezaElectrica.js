/**
 * Clase Hija de Pieza, representa una pieza eléctrica.
 * 
 * Hereda de la clase Pieza, por lo que tiene todos sus atributos y métodos.
 * Aquí solo añadimos lo que es propio de las piezas eléctricas: Potencia y voltaje.
 * 
 * Este archivo tiene que cargarse después de pieza.js en el index.html porque necesita que la clase Pieza ya exista.
 */

class PiezaElectrica extends Pieza {

    // ====== Datos fijos del enunciado ======
    // Los dejamos como propiedades "static" para que la factoria pueda 
    // leerlos y elegir uno al azar sin tener que repetir las listas en
    // otro archivo.

    // Subtipos posibles de pieza eléctrica
    static NOMBRES = [
        "Placa ABS",
        "Centralita encendido",
        "Bornes cableado",
        "Alternador",
        "Encendido"];

    // Potencias posibles en Watios
    static POTENCIAS = [1, 5, 10, 20];

    // Voltajes posibles en Voltios
    static VOLTAJES = [3.3, 5, 12, 240];

    /**
     * 
     * @param {string} nombre - Subtipo (uno de Nombres)
     * @param {string} codigo - Número de serie + letra "E"
     * @param {Date} fechaFabricacion - Fecha de fabricación
     * @param {number} potencia - Watios
     * @param {number} voltaje - Voltios
     */
    constructor(nombre, codigo, fechaFabricacion, potencia, voltaje) {
        // super() llama al constructor de Pieza para rellenar lo común
        // Al ser una clase hija, es obligatorio llamar aquí antes de usar "this"
        super(nombre, codigo, fechaFabricacion);

        // Tipo de pieza, para que la estación de tratamiento sepa qué hacer con ella
        this.tipo = "electrica";

        // Atributos propios de las piezas eléctricas.
        this.potencia = potencia;
        this.voltaje = voltaje;
    }

    /**
     * Sobrescribe describir() de Pieza: 
     * reutiliza el texto del padre con super.describir y 
     * le añade datos eléctricos
     * @returns El texto del padre con super.describir y le añade datos eléctricos.
     */
    describir(){
        return `[Eléctrica] 
        ${super.describir()} | ${this.potencia} W |
         ${this.voltaje} V`;
    }
}