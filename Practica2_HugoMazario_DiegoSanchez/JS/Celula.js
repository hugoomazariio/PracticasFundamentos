
class Celula{

    constructor(){

        this.viva = false;

        this.tiempo = 0;
    }

    alternar(){
        this.viva = !this.viva;
        this.tiempo = 0;
    }

    actualizar(nuevoEstado){
        if (nuevoEstado === this.viva){
            this.tiempo++;
        } else {
            this.viva = nuevoEstado; 
            this.tiempo = 0;
        }
    }
}