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
        Request
        .build({ id_aire:req.params.id_aire,date:new Date().toISOString().slice(0,10), id_user : req.session.user.id})
        .save()
        .then(request=>{
            if(!request){
                return res.status(400).send({message:"erreur"});
            }
            else{
                return res.status(200).send({message: "enregistré avec succees"});
            }
        }).catch(error=>res.status(400).send(error));
    },

};
