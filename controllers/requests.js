/**
 * @author JEAN ROGER NIGOUMI GUIALA
 * @description controlleur pour les requetes d'un utilisateur
 */

const Request = require('../models').request;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var sess;

module.exports = {


    
};
