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

function changeUndefined(variable) {
    if (!variable) {
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
                            insee: req.body.insee,
                            section: { [Op.iLike]: '%' + changeUndefined(req.body.section) + '%' }
                        },
                        sequelize.where(sequelize.cast(sequelize.col('parcelle.numpar'), 'varchar'),
                            { [Op.iLike]: '%' + changeUndefined(req.body.numpar) + '%' }),
                    ],
                },
                attributes: { exclude: ['geom'] },
                limit: 50,
                order: [
                   
                    ['numpar', 'ASC'],
                ]
            })
            .then(parcelles => {
                if (!parcelles) {
                    return res.status(404).send({
                        message: 'pas trouvé',
                    });
                }
                return res.status(200).send((JSON.stringify(parcelles)));
            })
            .catch(error => res.status(400).send(error));
    },
    getParcelle(req,res){
        return Parcelle
        .findOne({
            where:{
                id: req.params.id
            }
        })
        .then(parcelle =>{
            if(!parcelle){
                return res.status(404).send({
                    message: "pas trouvé"
                });
            }
            sess = req.session;
            if (typeof (sess.aire) == 'undefined') {
                sess.aire = [];
            }
           
            return res.status(200).send(parcelle);
        })
        .catch(error=> res.status(400).send(error));
    }

};

