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

    createRequest(req,res){
        console.log("debut fonction ajout requete");
        let request = new Request({
            id_aire:req.params.id_aire,
            date:new Date().toISOString().slice(0,10),
            id_user : req.session.user.id,
            
        });
        request.save(error => {
            if (error) {
                res.send(error);
            } else {
                res.status(200).send({ message: "crée avec succès" });
            }

        });
    },

};
