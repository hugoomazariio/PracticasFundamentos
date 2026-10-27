// Programa realizado por Hugo Mazarío Ros y Diego Sánchez Álvarez

/**
 * Clase Hija de Pieza, representa una pieza eléctrica.
 * 
 * Hereda de la clase Pieza, por lo que tiene todos sus atributos y métodos.
 * Aquí solo añadimos lo que es propio de las piezas mecánicas: el material de fabricación.
 * 
 * Este archivo tiene que cargarse después de pieza.js en el index.html porque necesita que la clase Pieza ya exista.
 */
class PiezaMecanica extends Pieza{
  // ====== Datos fijos del enunciado ======
    // Los dejamos como propiedades "static" para que la factoria pueda 
    // leerlos y elegir uno al azar sin tener que repetir las listas en
    // otro archivo.
    
    // Subtipos posibles de pieza mecánica
    static NOMBRES = [
        "Larguero inferior",
        "Guardabarros",
        "Larguero superior",
        "Subchasis",
        "Puerta"];

    // Materiales posibles
    static MATERIALES = ["Acero", "Titanio", "Carbono"];

    /**
     * 
     * @param {string} nombre - Subtipo (uno de Nombres)
     * @param {string} codigo - Número de serie + letra "M"
     * @param {Date} fechaFabricacion - Fecha de fabricación
     * @param {string} material - "Acero", "Titanio" o "Carbono"
     */

    constructor(nombre, codigo, fechaFabricacion, material) {
        
        // Rellena los atributos comunes llamando al constructor del padre
        super(nombre, codigo, fechaFabricacion);

        // Tipo de pieza, para que la estación de tratamiento sepa qué hacer con ella
        this.tipo = "mecanica";

        // Atributo propio de las piezas mecánicas.
        this.material = material;
    }

    /**
     * Sobrescribe describir() de Pieza añadiendo el material
     * @returns Añade el material al método describir de Pieza().
     */
    describir(){
        return `[Mecánica] 
        ${super.describir()} | Material: ${this.material}`;
    }
}