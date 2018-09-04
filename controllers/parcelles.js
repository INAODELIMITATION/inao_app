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

function changeUndefined(variable){
    if(!variable){
        variable = '';
    }
    return variable;
}
module.exports = {
    getAll(req, res) {
        return Parcelle
            .findOne({ attributes: { exclude: ['geom'] } })
            .then(parcelles => res.status(200).send(parcelles))
            .catch(error => res.status(400).send(error));
    },

    findCommunes(req, res) {
        console.log("debut méthode findCommunes");
        return Parcelle
            .findAll({
                raw: true,
                where: {
                    commune: { [Op.iLike]: '%' + req.params.commune + '%' }
                },
                limit: 10,
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('commune')), 'commune']],
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
        return Parcelle
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
    },

    /**
     * Fonction qui recupère une liste de parcelle, connaissant déja l'INSEE et en fonction 
     * de la section et du numéro de parcelle, vide ou rempli 
     * @param {*} req 
     * @param {*} res 
     */
    fetchParcelles(req, res) {
        return Parcelle
            .findAll({
                raw: true,
                where: {
                    [Op.and]: [
                        {
                            insee:  req.body.insee ,
                            section: { [Op.iLike]: '%' + changeUndefined(req.body.section) + '%' }
                        },
                        sequelize.where(
                            sequelize.cast(sequelize.col('parcelle.numpar'), 'varchar'),
                            { [Op.iLike]: '%' +changeUndefined(req.body.numpar) + '%' }
                        ),
                    ],
                },
                limit: 10,
                attributes: { exclude: ['geom'] },
            })
            .then(parcelles => {
                if (!parcelles) {
                    return res.status(404).send({
                        message: 'pas trouvé',
                    });
                }
                return res.status(200).send({ parcelles: parcelles });
            })
            .catch(error => res.status(400).send(error));
    }

};

