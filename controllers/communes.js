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
    findCommunes(req, res) {
        console.log("debut méthode findCommunes");
        return Commune
            .findAll({
                raw: true,
                where: {
                    nom_com: { [Op.iLike]: '%' + req.body.commune + '%' }
                },
                limit: 10,
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
    fetchCommune(req, res) {
        console.log("debut méthode fetch commune");
        return Commune
            .findAll({
                raw: true,
                where: {
                    commune: req.params.commune,
                },
                attributes: ['commune', 'insee'],
            })
            .then(commune => {
                if (!commune) {
                    return res.status(404).send({
                        message: 'pas trouvé',
                    });
                }
                return res.status(200).send({ commune: commune });
            })
            .catch(error => res.status(400).send(error));
    }
};