/**
 * @file LienSiqo Controlleur pour le modele V_siqo_lien
 * @author Guiala Jean Roger
 * @version 1.0.0
 * Dans ce fichier nous mettrons toutes les fonctions pour recupérer/modifier les valeurs de notre modèle
 */

const lienSiqo = require('../models').v_siqo_lien;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

module.exports = {


getLien(req,res){
    return lienSiqo
    .findOne({
        where:{
            id_aire: parseInt(req.params.id_aire)
        }
    })
    .then(lien=>{
        if(!lien){
            return res.status(404).send('aucune appellation');
        }else{
            return res.status(200).send(lien);
        }
    }).catch(error=>res.status(400).send(error));
}

};