/**
 * @author JEAN ROGER NIGOUMI GUIALA
 * @description controlleur pour les aire géographique
 */

const Parcelle = require('../models').parcelle;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var sess;

module.exports = {
    getAll(req,res){
        return Parcelle
        .findOne({ attributes: { exclude: ['geom'] } })
        .then(parcelles =>res.status(200).send(parcelles))
        .catch(error => res.status(400).send(error));
    },

   findCommunes(req,res){
    console.log("debut méthode findCommunes");
    return Parcelle
    .findAll({
        raw:true,
        where: {
            commune: { [Op.iLike]: '%' + req.params.commune + '%' }
        },
        limit: 30,
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('commune')), 'commune']],
    })
    .then(parcelles => {
        if (!parcelles) {
            return res.status(404).send({
                message: 'parcelles pas trouvé',
            });
        }
        console.log("success");
        return res.status(200).send(JSON.stringify(parcelles));

    })
    .catch(error => res.status(400).send(error));
   }

};

