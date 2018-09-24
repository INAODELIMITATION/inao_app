/**
 * @author JEAN ROGER NIGOUMI GUIALA
 * @description controlleur pour les libelle aire
 */

const Zone = require('../models').v_lst_zone;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var sess;

/**
 * Fonction qui initialise l'objet de la couche chargé en session
 * @param {String} type 
 * @param {String} valeur 
 * @param {Number} id_denom 
 */
function setParams(type, valeur, id_denom) {
    var tab = {
        type: type,
        valeur: valeur,
        id: id_denom,
    }; 
    return tab;
}
module.exports = {

};