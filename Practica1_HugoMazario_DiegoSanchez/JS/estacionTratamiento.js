/**
 * La estación de tratamiento recibe piezas, mira de qué tipo son 
 * y les aplica el acabado que corresponda.
 * También lleva la cuenta de cuántas piezas ha sometido a cada tratamiento.
 * 
 * Es importante que este archivo se cargue después de piezaElectrica.js
 * y piezaMecanica.js, porque usa instanceof con esas clases
 */

class EstacionTratamiento {

    constructor() {
        // Contadores internos, uno por cada tratamiento
        this._barnizadasNormal = 0;
        this._barnizadaEspecial = 0;
        this._galvanizadas = 0;
        this._pulidas = 0;
        this._pintadas = 0;
    }

    // Getters

    get barnizadasNormal() {
        return this._barnizadasNormal
    }

    get barnizadasEpecial() {
        return this._barnizadaEspecial
    }

    get galvanizadas() {
        return this._galvanizadas
    }

    get pulidas() {
        return this._pulidas
    }

    get pintadas() {
        return this._pintadas
    }

    /**
     * Total de piezas procesadas: suma de todos los tratamientos.
     * Debe coincidir siempre con las piezas que ha generado la factoría.
     */
    get totalProcesadas(){
        return this._barnizadasNormal + this._barnizadaEspecial +
         this._galvanizadas + this._pulidas + this._pintadas;
    }


    // MÉTODO PRINCIPAL

    /**
     * Procesa una pieza: decide el tratamiento según su tipo, lo anota en la propia pieza
     * y suma 1 al contador correspondiente.
     * @param {Pieza} pieza - Pieza eléctrica o mecánica recién fabricada
     * @returns {Pieza} La misma pieza, ya con su etiqueta de procesamiento
     */
    procesarPieza(pieza) {

        // Primero examinamos su tipo
        // El atributo "tipo" que cada clase de pieza se pone a sí misma.
        if (pieza.tipo === "electrica") {

            // Eléctricas: el tratamiento depende de la potencia
            if (pieza.potencia <= 5){

                // 1 o 5 W -> barniz normal
                pieza.procesamiento = "Barnizada normal";
                this._barnizadasNormal++;

            } else{

                // 10 o 20 W -> barniz especial
                pieza.procesamiento = "Barnizada especial";
                this._barnizadaEspecial++;

            }

        } else if (pieza.tipo === "mecanica"){

            // Mecánicas: el tratamiento depende del material
            switch (pieza.material){
                case "Acero":
                    pieza.procesamiento = "Galvanizada"
                    this._galvanizadas++;
                    break;
                case "Titanio":
                    pieza.procesamiento = "Pulida";
                    this._pulidas++;
                    break;
                case "Carbono":
                    pieza.procesamiento = "Pintada"
                    this._pintadas++;
                    break;        
            }
        }
        
        // Devolvemos la pieza ya "marcada" con su procesamiento
        return pieza;
    }
}