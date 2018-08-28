/**
 * @author JEAN ROGER NIGOUMI GUIALA
 * @description controlleur pour les aire géographique
 */

const Aire_Geo = require('../models').aire_geo;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var sess;

module.exports={

    /**
     * Récupère une aire géographique en fonction de la dénomination
     * @param {*} req 
     * @param {*} res 
     */
    retrieveByDenom(req,res){
        return Aire_Geo
        .findOne({
           raw:true,
           where:{
               denomination:req.params.denomination,
           },

        })
        .then(aire_geo=>{
            if(!aire_geo){
                return res.status(404).send({
                    message: 'denomination pas trouvé',
                });
            }
            sess= req.session;
            if (typeof (sess.aire) == 'undefined') {
                sess.aire = [];
            }
            return res.status(200).send({ aire_geo: aire_geo});
        })
        .catch(error => res.status(400).send(error));
    },
};