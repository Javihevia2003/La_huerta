"use strict";
const fs = require("fs");
const { DateTime } = require("luxon");
const Planta = require("./clasePlantas.js")
const readline = require("readline")
const rl = readline.createInterface(
    process.stdin,
    process.stdout
);
let fichero;
try {
    fichero = fs.readFileSync("cultivos.json", "utf-8");
} catch (error) {
    console.log("error al buscar el archivo");
    process.exit();
}
// creamos la lista de los cultivos que esten recolectados;
let recolectados = [];
let cultivos = [];
try {
    cultivos = JSON.parse(fichero);
} catch (error) {
    console.log("formato de fichero invalido");
    process.exit();
}
// ==========================================================================================
/**
 * INTERVALO
 */
/**
 * Funcion que crea el intervalo
 * @param {Array} huerta 
 */
function ticker(huerta) {
    setInterval(() => {
        const ahora = DateTime.local();
        for (let planta of huerta) {
            if (planta._estado === "neutral" && ahora >= planta._fecha_fin_accion) {
                console.log("💀", planta._nombre + " ha muerto");
                planta._fecha_fin_accion = 0;
                planta._estado = "muerto";
            } else if (planta._estado === "regando" && ahora >= planta._fecha_fin_accion) {
                console.log("💦", planta._nombre, " ha sido regada");
                planta._estado="recolectar";
                
                // Verificar si el tiempo de recolección ha sido completado
                if (planta._estado=="recolectar") {
                    console.log("🧺", planta._nombre, " está lista para ser recolectada");
                    planta._tiempo_para_recoleccion = 0;
                    planta._fecha_fin_accion = planta._fecha_fin_accion.plus({ seconds: planta._tiempo_recoleccion * 2 });
                    planta._estado="recolectar";
                } else {
                    planta._fecha_fin_accion = planta._fecha_fin_accion.plus({ seconds: planta._tiempo_regado * 2 });
                    planta._estado = "neutral";
                }
            } else if (planta._estado === "recolectar" && ahora >= planta._fecha_fin_accion) {
                console.log("💀 >> - " + planta._nombre + " ha muerto");
                planta._fecha_fin_accion = 0;
                planta._estado = "muerto";
            }
        }
    }, 250);
}
// ICONO DE CADA CULTIVO:
/*
PLANTA NORMAL 🌱
patata 🥔
manzana 🍎
zanahoria 🥕 
tomate 🍅
lechuga 🥬 
planta muerta 💀
regando 💦
*/
/**
 * Menu del programa que lee un archivo json y muestra las opciones. Recibe la lista de las cajas ya que
 * pueden surgir modificaciones durante la ejecucion del programa.
 * @returns 
 */


// CREAMOS LA LISTA DE PLANTADOS EN LA HUERTA;
let huerta = [];
async function menu() {
    console.log("MENU")

    let opcion;
    try {
        opcion = await leeLinea("\n1.Plantar cultivo\n2.Regar cultivo\n3.Recolectar cultivo\n4.Listar cultivo\n5.Eliminar cultivo\n6.Consultar cultivo recolectado\nEscoja una opción:", 1, 6);
    } catch (error) {
        console.log("error al pedir la opcion");
        return menu();
    }
    switch (opcion) {
        case "1":
            await plantarCultivo(cultivos);
            ticker(huerta);
            return menu();
        case "2":
            await regarCultivo(huerta);
            return menu();
        case "3":
            recolectarCultivo(huerta);
            return menu();
        case "4":
            listarCultivo(huerta);
            return menu();
        case "5":
            eliminarCultivos(huerta);
            break;
        case "6":
            consultarRecolectados(recolectados);
            return menu();
        default:
            return menu();
    }
}

// FUNCIONES:
/**
 * 1.Pregunta qué cultivo se desea plantar y planta uno.
 * Crea un cultivo plantado y muestra un mensaje de éxito.
 * @param {Array} cultivos - El array de cultivos disponibles.
 */
async function plantarCultivo(cultivos) {
    console.log("Estas son tus opciones:\n");
    for (let i = 0; i < cultivos.length; i++) {
        switch (cultivos[i].nombre) {
            case "patata":
                cultivos[i].emoji = "🥔";
                break;
            case "manzana":
                cultivos[i].emoji = "🍎";
                break;
            case "tomate":
                cultivos[i].emoji = "🍅";
                break;
            case "zanahoria":
                cultivos[i].emoji = "🥕";
                break;
            case "lechuga":
                cultivos[i].emoji = "🥬";
                break;
            default:
                break;
        }
        console.log(
            "\n" +
            (i + 1) +
            ".➡️  " +
            cultivos[i].emoji +
            "  " +
            cultivos[i].nombre +
            " [ tiempo de regado : " +
            cultivos[i].tiempo_regado +
            "s ][ regado total : " +
            cultivos[i].tiempo_recoleccion +
            "s ]\n"
        );
    }

    let opcion = parseInt(await leeLinea("\n➡️  Qué deseas plantar?:")) - 1;
    while (isNaN(opcion) || opcion < 0 || opcion >= cultivos.length) {
        console.log("No tenemos ese tipo de cultivo");
        opcion = parseInt(await leeLinea("\n➡️  Qué deseas plantar?:")) - 1;
    }
    const planta = new Planta(
        cultivos[opcion].nombre,
        cultivos[opcion].tiempo_regado,
        cultivos[opcion].tiempo_recoleccion,
        cultivos[opcion].emoji
    );
    huerta.push(planta);
    console.log(
        "Has plantado una " +
        cultivos[opcion].nombre +
        " " +
        cultivos[opcion].emoji +
        "!!"
    );
}

/**
 * 2.Riega un cultivo seleccionado por su identificador.
 * Solo se puede regar un cultivo en estado "neutral" (seco).
 * @param {Array} huerta - El array de plantas en la huerta.
 */
async function regarCultivo(huerta) {
    let plantasPorRegar = [];
    console.log("💧>> - Plantas por regar - <<💧\n");
    for (const planta of huerta) {
        if (planta._estado === "neutral") {
            plantasPorRegar.push(planta);
        }
    }

    if (plantasPorRegar.length > 0) {
        console.log(
            plantasPorRegar
                .map(
                    (planta, i) =>
                        `${i + 1}.>> -${planta._nombre} estado: ${planta._estado}\n`
                )
                .join("")
        );

        let opcion = parseInt(await leeLinea("\n💧>> - Qué cultivo deseas regar?\n")) - 1;

        while (isNaN(opcion) || opcion < 0 || opcion >= plantasPorRegar.length) {
            console.log(">> - Opción incorrecta\n");
            opcion = parseInt(await leeLinea("\n💧>> - Qué cultivo deseas regar?\n")) - 1;
        }

        const plantaSeleccionada = plantasPorRegar[opcion];

        if (plantaSeleccionada._estado === "neutral") {
            console.log(`- El cultivo ${plantaSeleccionada._nombre} está siendo regado 💧\n`);
            plantaSeleccionada._fecha_fin_accion = DateTime.local().plus({ seconds: plantaSeleccionada._tiempo_regado });
            plantaSeleccionada._estado = "regando";
        } else {
            console.log(`>> - El cultivo ${plantaSeleccionada._nombre} ya está húmedo, no es necesario regarlo\n`);
        }
    } else {
        console.log("💧>> - No hay cultivos para regar\n");
    }
}

/**
 * 3.Preguntará por el cultivo y lo recolecta. Sólo podremos recolectar cultivos que han
completado el tiempo de recolección húmedos.
* @param {any} cultivos 
*/
async function recolectarCultivo(huerta) {
    console.log("🧺>> - Plantas para recolectar - <<🧺\n");
    const plantasParaRecolectar = huerta.filter((planta) => planta._estado === "recolectar");

    if (plantasParaRecolectar.length > 0) {
        console.log(plantasParaRecolectar.map((planta, index) => `${index + 1}.>> -  ${planta._nombre} estado: ${planta._estado}\n`).join(''));

        let opcion = parseInt(await leeLinea("\n🧺>> - Qué deseas recolectar?\n")) - 1;

        while (opcion < 0 || opcion >= plantasParaRecolectar.length) {
            console.log(">> - Opción incorrecta\n");
            opcion = parseInt(await leeLinea("\n🧺>> - Qué deseas recolectar?\n")) - 1;
        }

        const plantaSeleccionada = plantasParaRecolectar[opcion];
        console.log(`- La planta ${plantaSeleccionada._nombre} ha sido recolectada 🧺\n`);
        plantaSeleccionada._estado = "recolectado";
        recolectados.push(plantaSeleccionada);
        huerta.splice(huerta.indexOf(plantaSeleccionada), 1);
        return menu();
    } else {
        console.log("🧺>> - No hay plantas para recolectar\n");
    }

}
/**
 * 4.Lista los cultivos de forma amable indicando los siguiente datos: nombre de cultivo,
identificador del cultivo, cuántos segundos faltan para tener que volver a regarlo,
cuántos segundos faltan para poder recolectarlo,...
* @param {any} cultivos 
*/
function listarCultivo(huerta) {

    console.log("🌱>> - Plantaciones - <<🌱\n");

    for (const planta of huerta) {
        let estado = "";

        switch (planta._estado) {
            case "muerto":
                estado = "💀";
                break;
            case "regando":
                estado = "💧";
                break;
            case "recolectar":
                estado = "🧺";
                break;
            default:
                estado = "🌱";
        }

        console.log(`${estado} ${planta._nombre} estado: ${planta._estado}\n`);
    }

}
/**
 * 5.Lista y permite escoger el cultivo que quieres eliminar
 */
async function eliminarCultivos(huerta) {
    console.log("🗑️>> - Plantas para eliminar - <<🗑️\n");
    for (let i = 0; i < huerta.length; i++) {
        console.log(`${i + 1}.>> -${huerta[i]._nombre} estado: ${huerta[i]._estado}\n`);
    }

    let opcion = parseInt(await leeLinea("\n🗑️>> - Qué deseas eliminar?\n")) - 1;

    while (isNaN(opcion) || opcion < 0 || opcion >= huerta.length) {
        console.log(">> - Opción incorrecta\n");
        opcion = parseInt(await leeLinea("\n🗑️>> - Qué deseas eliminar?\n")) - 1;
    }

    console.log(`🗑️>> - ${huerta[opcion]._nombre} estado: ${huerta[opcion]._estado} ha sido eliminada\n`);
    huerta.splice(opcion, 1);
    return menu();
}

/**
 * 6.Lista qué cultivos se han recolectado con éxito
 * @param {array} recolectados 
 */
function consultarRecolectados(recolectados) {
    console.log("🧺>> - Plantas recolectadas - <<🧺\n")
    if(recolectados.length){
        for(const plantas of recolectados){
            console.log(DateTime.local().toISO()+" >> -"+plantas._nombre+" estado: "+plantas._estado+"\n")
        }
    }else{
        console.log(">> - no hay plantas recolectadas\n")
    }
}


/**
 * Función que recibe un texto y dos numeros ambos opcionales, por defecto son undefined
 * si no se los envias devuelve lo introducido por pantalla, si se los envias devuelve
 *  el numero introducido si esta entre el minimo y el maximo, si no 
 * envia un error
 * @param {String} texto texto a mostrar por pantalla
 * @param {Number} min numero minimo
 * @param {Number} max numero maximo
 * @returns 
 */
function leeLinea(texto, min = undefined, max = undefined) {
    return new Promise((resolve, reject) => {
        if (min != undefined && max != undefined) {
            rl.question(texto, (introducido) => {
                if (introducido >= min && introducido <= max) {
                    resolve(introducido);
                }
                reject(new Error("Error opcion invalida"))
            })
        } else {
            rl.question(texto, (introducido) => {

                resolve(introducido);

            })
        }

    })
}

menu();

