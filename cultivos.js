// diferenciar entre humedos y secos
// 3.Mostrarátodos los que estan plantados
// 5. se eliminan todos ncluidos los muertos
// dos listas, plantado y recoolectado
// la recoleccion solo corre cuando esta regando,
// 4 tics por seundos dentro del intervalo;
// fecha en la que se regó la planta
// primera linea del intervalo: 
console.log("hola");
// setInterval(() => {
//    const fecha=DateTime.local();
//    for (const palntado of plantados) {
//     // si esta muerto continue
//     // si esta regado miramos cuanto lleva fecha1.diff(fecha2,"seconds")seconds
//    } 
// }, );
"use strict";

const fs = require('fs');
const { DateTime } = require("luxon");
let cultivos = JSON.parse(fs.readFileSync('cultivosPlantar.json'));

const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Función que permite introducir por teclado
 * @param {String} texto 
 * @returns 
 */
function leeLinea(texto) {
    return new Promise((resolve) => {
        rl.question(texto, (introducido) => {
            resolve(introducido);
        });
    });
};

// Función pora guardar los cambios en agenda.json
function guardarCambios() {
    fs.writeFileSync("cultivosPlantar.json", JSON.stringify(cultivos));
}

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// MENÚ
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

/**
 * Función para mostrar el menú y leer la opción del usuario
 * @returns {Array}
 */
async function mostrarMenu() {
    console.log("\n***AGENDA***:\n");
    console.log("1.Plantar cultivo");
    console.log("2.Regar cultivo");
    console.log("3.Recolectar cultivo");
    console.log("4.Listar cultivo");
    console.log("5.Eliminar cultivo");
    console.log("Consultar cultivos recolectados")

    let opcion = await leeLinea("Selecciona una opción:");
    switch (opcion) {
        case "1":
            
            break;
        case "2":
            
            break;
        case "3":
           
            break;
        case "4":
           
            break;
        case "5":
            
            break;
        case "5":
            
            break;
        default:
            
            break;
    }
};
/******************************************************************************** */
/*FUNCIONES */
// 1. Plantar cultivo
// Preguntará qué cultivo y plantará uno
// Crea un cultivo plantado y dirá que se ha plantado y el identificador del cultivo (por
// ejemplo: “patata_1”).
async function plantarCultivo() {
    cultivosDisponibles=[];
    cultivosPlantados=[]
    let pregunta=await leeLinea("¿Que tipo de cultivo quieres plantar?:")
    for (const cultivo of cultivos) {
        cultivosDisponibles.push(cultivo.nombre)
        if(pregunta!=cultivo.nombre){
            return 'No existe ese cultivo'
        }

    }
}