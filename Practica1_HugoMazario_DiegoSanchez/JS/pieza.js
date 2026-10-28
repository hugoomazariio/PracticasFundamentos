// Programa realizado por Hugo Mazarío Ros y Diego Sánchez Álvarez

/**
 * Aquí solo van los atributos que comparten todas las piezas (eléctricas y mecánicas)
 * - Nombre (subtipo)
 * - Código ( 10 cifras + letra E o M)
 * - Fecha de fabricación
 * 
 * Además añadimos "procesamiento": Todas las piezas acaban siendo tratadas
 * por la estación de tratamiento, así que todas necesitan esa etiqueta.
 * Empieza en null porque la pieza todavía no ha sido tratada cuando se crea.
 */

class Pieza{
    /**
     * Constructor de la clase Pieza
     * @param {string} nombre - Subtipo de la pieza
     * @param {string} codigo - Número de serie de 10 cifras + letra
     * @param {Date} fechaFabricacion - Fecha de fabricación de la pieza
     */
    constructor(nombre, codigo, fechaFabricacion){
        this.nombre = nombre;
        this.codigo = codigo;
        this.fechaFabricacion = fechaFabricacion;

        // La rellena la estación de tratamiento
        this.procesamiento = null;
    }

    /**
     * Describe la pieza
     * @returns Devuelve un texto con los datos comunes de la Pieza. Las clases hijas lo reutilizan y le añaden sus datos propios.
     */
    describir(){
        let tratamiento;
        if (this.procesamiento === null){ // Si aún no ha pasado por la estación (null), mostramos "Sin tratar"
            tratamiento = "Sin tratar";
        } else{
            tratamiento = this.procesamiento;

        }
        return  `${this.nombre} | Código: ${this.codigo} | ` +
               `Fabricada: ${this.fechaFabricacion.toLocaleDateString("es-ES")} | ` +
               `Procesamiento: ${tratamiento}`;
    }
}