// Programa realizado por Hugo Mazarío Ros y Diego Sánchez Álvarez

// Espera a que todo esté cargado antes de asignar los eventos a los botones
window.addEventListener("load", iniciar, false);

// Ruta al sonido de botón
const sonidoBoton = new Audio("./Audio/Sonido_Fabricacion.mp3");

/**
 * Vincula los botones de la interfaz a la función de simulación
 */
function iniciar() {

    // Evento para el botón de fabricar 100 piezas
    document.getElementById("btn-100").addEventListener("click", function () {
        sonidoBoton.play();
        simular(100);
    }, false);

    // Evento para el botón de fabricar 1000 piezas
    document.getElementById("btn-1000").addEventListener("click", function () {
        sonidoBoton.play();
        simular(1000);
    }, false);

}

/**
 * Actualiza la interfaz con los textos y los datos de la simulación
 * @param {Object} resultado - Objeto que contiene todos los contadores de la fábrica y de la estación.
 */
function mostrarResultado(resultado) {
    actualizarResultado("res-total", ["Piezas totales: ", resultado.total]);
    actualizarResultado("res-factoria", [
        "La factoría ha fabricado: ", resultado.total,
        " de las cuales ", resultado.electricas,
        " son de tipo eléctrico y ", resultado.mecanicas,
        " son de tipo mecánico."
    ]);
    actualizarResultado("res-estacion-electricas", [
        "De las eléctricas, la estación de tratamiento ha aplicado barniz normal a ",
        resultado.barnizadasNormal,
        " y ha aplicado barniz especial a ",
        resultado.barnizadasEspecial,
        "."
    ]);
    actualizarResultado("res-estacion-mecanicas", [
        "De las mecánicas ha galvanizado: ", resultado.galvanizadas,
        ", ha pintado ", resultado.pintadas,
        " y ha pulido ", resultado.pulidas, "."
    ]);
}

/**
 * Muestra los números del resultado resaltados sin interpretar los datos como HTML.
 * @param {string} id - Identificador del párrafo que se actualizará.
 * @param {Array<string|number>} partes - Texto y valores numéricos en orden.
 */
function actualizarResultado(id, partes) {
    const elemento = document.getElementById(id);
    const nodos = partes.map(function (parte) {
        if (typeof parte === "number") {
            const numero = document.createElement("strong");
            numero.textContent = parte;
            return numero;
        }

        return document.createTextNode(parte);
    });

    elemento.replaceChildren(...nodos);
}

/**
 * Crea una nueva fábrica para empezar con los contadores a cero y ejecuta la fabricación.
 * @param {number} cantidad - Número de piezas a simular (100 o 1000).
 */
function simular(cantidad) {
    const fabrica = new Fabrica();
    const resultado = fabrica.fabricar(cantidad);
    mostrarResultado(resultado);       
}


