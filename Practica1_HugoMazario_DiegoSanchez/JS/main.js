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
    
    // Total de piezas fabricadas
    document.getElementById("res-total").textContent = `Piezas totales: ${resultado.total}`;

    // Desglose de la factoría (eléctricas vs mecánicas)
    document.getElementById("res-factoria").textContent = `La factoría ha fabricado: ${resultado.total} 
    de las cuales  ${resultado.electricas} son de tipo eléctrico y ${resultado.mecanicas} son de tipo mecánico.`;
    
    // Tratamientos aplicados a las piezas eléctricas
    document.getElementById("res-estacion-electricas").textContent = `De las eléctricas, la estación de tratamiento 
    ha aplicado barniz normal a ${resultado.barnizadasNormal} y ha aplicado barniz especial a
    ${resultado.barnizadasEspecial}.`;
    
    // Tratamientos aplicados a las piezas mecánicas
    document.getElementById("res-estacion-mecanicas").textContent = `De las mecánicas ha galvanizado: ${resultado.galvanizadas}
    ha pintado ${resultado.pintadas} y ha pulido ${resultado.pulidas}.`;
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



