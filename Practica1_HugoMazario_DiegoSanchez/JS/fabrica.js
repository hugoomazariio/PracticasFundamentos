/** 
 * La fábrica agrupa las instalaciones (factoría y estación de tratamiento)
 * y coordina el proceso completo: la factoría crea la pieza y la estación 
 * la trata.
 * 
 * Una fábrica tiene una factoría y tiene una estación. En este caso no se 
 * usa extends porque ni la factoría ni la estación son un tipo de fábrica, 
 * son partes de ella.
 * 
 * Es importante que este archivo se cargue después de factoria.js 
 * y estacionTratamiento.js
 */

class Fabrica{

    constructor(){
        // La fábrica crea sus propias instalaciones. Cada una lleva su cuenta.

        this.factoria = new Factoria();
        this.estacion = new EstacionTratamiento();
    }

    fabricar(cantidad){
        for (let i = 0; i < cantidad; i++){

            // La factoria genera una pieza al azar.
            const piezaGenerada = this.factoria.generarPieza();

            // La estación la examina, la procesa y la marca.
            this.estacion.procesarPieza(piezaGenerada);
        }

        // 
        return{
            // Contadores de la factoría.
            total: this.factoria.totalElectricas+totalMecanicas,
            electricas: this.factoria.totalElectricas,
            mecanicas: this.factoria.totalMecanicas,

            // Contadores de la estación de tratamiento.
            barnizadasNormal: this.estacion.barnizadasNormal,
            barnizadasEspecial: this.estacion.barnizadasEspecial,
            galvanizadas: this.estacion.galvanizadas,
            pintadas: this.estacion.pintadas,
            pulidas: this.estacion.pulidas
        };
    }

}