function mostrarResultado(resultado) {
    
    document.getElementById("res-total").textContent = `Piezas totales: ${resultado.total}`;

    document.getElementById("res-factoria").textContent = `La factoría ha fabricado: ${resultado.total} 
    de las cuales  ${resultado.electricas} son de tipo eléctrico y ${resultado.mecanicas} son de tipo mecánico.`;
    
    document.getElementById("res-estacion-electricas").textContent = `De las eléctricas, la estación de tratamiento 
    ha aplicado barniz normal a ${resultado.barnizadasNormal} y ha aplicado barniz especial a
    ${resultado.barnizadasEspecial}.`;
    
    document.getElementById("res-estacion-mecanicas").textContent = `De las mecánicas ha galvanizado: ${resultado.galvanizadas}
    ha pintado ${resultado.pintadas} y ha pulido ${resultado.pulidas}.`;
}

function simular(cantidad) {
    const fabrica = new Fabrica();
    const resultado = fabrica.fabricar(cantidad);
    mostrarResultado(resultado);       
}

function iniciar() {

    document.getElementById("btn-100").addEventListener("click", function () {
        simular(100);
    }, false);

    document.getElementById("btn-1000").addEventListener("click", function () {
        simular(1000);
    }, false);

}

