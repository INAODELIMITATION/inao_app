/**
 * @author JEAN ROGER NIGOUMI GUIALA
 * @description controlleur pour les aire géographique
 */

const Commune = require('../models').commune;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var sess;

module.exports = {
    fetchCommunes(req, res) {
        console.log("debut méthode findCommunes");
        return Commune
            .findAll({
                raw: true,
                where: {
                    nom_com: { [Op.iLike]: '%' + req.body.commune + '%' }
                },
                // order: [
                //     ['nom_com', 'DESC'],
                // ],
                limit: 50,
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('nom_com')), 'commune'],'code_insee'],
            })
            .then(communes => {
                if (!communes) {
                    return res.status(404).send({
                        message: 'communes pas trouvé',
                    });
                }
                console.log("success");
                return res.status(200).send(JSON.stringify(communes));

            })
            .catch(error => res.status(400).send(error));
    },
    getCommune(req, res) {
        console.log("debut méthode fetch commune");
        return Commune
            .findOne({
                raw: true,
                where: {
                    code_insee: req.params.insee,
                },
                attributes: ['nom_com', 'code_insee','geom'],
            })
            .then(commune => {
                if (!commune) {
                    return res.status(404).send({
                        message: 'pas trouvé',
                    });
                }
                return res.status(200).send(commune );
            })
            .catch(error => res.status(400).send(error));
    }
};