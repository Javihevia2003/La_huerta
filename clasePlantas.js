"use strict";
const { DateTime } = require("luxon");

class Planta{
    /**
     * La clase de alimentos
     * @param {String} nombre Nombre del cultivo
     * @param {Number} tiempo_regado Tiempo que tarda el cultivo en ser regado
     * @param {Number} tiempo_recoleccion Tiempo que tarda entre estar regado ser recolectado
     * @param {String} emoji La imagen que corresponde a la planta
     */
    constructor(nombre,tiempo_regado,tiempo_recoleccion,emoji){
        this._nombre = nombre;
        this._fecha_plantado = DateTime.local();
        this._tiempo_regado = tiempo_regado;
        this._tiempo_recoleccion = tiempo_recoleccion;
        this._estado = "neutral";
        this._emoji = this._emoji;   
        this._fecha_fin_accion = this._fecha_plantado.plus({seconds : this._tiempo_regado}); 
        this._tiempo_para_recoleccion = tiempo_recoleccion;
    }
}

module.exports =Planta;