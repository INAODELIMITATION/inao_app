/**
 * @author Guiala Jean Roger
 * @description Controlleur contenant toutes les fonctions nécessaires pour les couches (aire parcellaire)
 * 
 */

const Aire_P = require('../models').aire_parcellaire;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var sess;
/**
 * Fonction qui initialise l'objet de la couche chargé en session
 * @param {String} type 
 * @param {String} valeur 
 * @param {Number} id_denom 
 */
function setParams(type,valeur,id_denom){
    var tab = {
        type:type,
        valeur:valeur,
        id:id_denom
    };
    console.log("ici");
    return tab;
}
module.exports = {

    /**
     * recupere la liste de tous les eléments sauf la géométrie
     * @param {*} req requete de l'utilisateur
     * @param {*} res reponse renvoyé
     */
    list(req, res) {
        return Aire_P
            .all({ attributes: { exclude: ['geom'] } })
            .then(aire_parcelles => res.status(200).send(aire_parcelles))
            .catch(error => res.status(400).send(error));
    },

    /**
     * recupérer un élément en fonction de son id 
     * @param {*} req requete de l'utilisateur
     * @param {*} res reponse renvoyé
     */
    retrieve(req, res) {
        return Aire_P
            .findById(req.params.AppelId)
            .then(aire_parcelle => {
                if (!aire_parcelle) {
                    return res.status(404).send({
                        message: 'Appelation pas trouvé',
                    });
                }
                return res.status(200).send(aire_parcelle);
            })
            .catch(error => res.status(400).send(error));
    },

    /**
     * recupérer la liste des appellation de dénomination donnée
     * @param {*} req requete de l'utilisateur
     * @param {*} res reponse renvoyé
     */
    retrieveBydenomination(req, res) {
        return Aire_P
            .findAll({
                raw: true,
                where: {
                    denomination: req.params.denom,
                },
                attributes: { exclude: ['geom'] },
            })
            .then(aire_parcelles => {
                if (!aire_parcelles) {
                    return res.status(404).send({
                        message: 'denomination pas trouvé',
                    });
                }
                sess = req.session;
                if (typeof (sess.aire) == 'undefined') {
                    sess.aire = [];
                }
                sess.aire.push(setParams("denomination",req.params.denom,aire_parcelles[0].id));
                return res.status(200).send({ denomination: aire_parcelles, filter: sess.aire });

            })
            .catch(error => res.status(400).send(error));
    },

    /**
     * recupérer la liste des aire parcellaire d'une denomination
     * @param {*} req 
     * @param {*} res 
     */
    findDeno(req, res) {
        console.log("debut méthode FindDeno");
        return Aire_P
            .findAll({
                raw: true,
                where: {
                    denomination: { [Op.iLike]: '%' + req.body.denom + '%' }
                },

                limit: 30,
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('id_denom')), 'id_denom'], 'denomination'],
            })
            .then(aire_parcelles => {
                if (!aire_parcelles) {
                    return res.status(404).send({
                        message: 'denomination pas trouvé',
                    });
                }
                console.log("success");
                return res.status(200).send(JSON.stringify(aire_parcelles));

            })
            .catch(error => res.status(400).send(error));
    },

    findDenoId(denomination) {
        return Aire_P
            .findAll({
                where: {
                    denomination: denomination
                },
                limit: 1,
            }).then(id_denom => {
                if (!id_denom) {
                    return null;
                }
                return id_denom;
            });
    },


    /**
     * recupérer la liste des aire parcellaires d'une appellation
     * @param {*} req 
     * @param {*} res 
     */
    findAppel(req, res) {
        console.log("debut méthode FindAppel");


        return Aire_P
            .findAll({
                raw: true,
                where: {
                    appellation: { [Op.iLike]: '%' + req.body.appel + '%' }
                },

                limit: 30,
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('id_app')), 'id_app'], 'appellation'],
            })
            .then(aire_parcelles => {
                if (!aire_parcelles) {
                    return res.status(404).send({
                        message: 'denomination pas trouvé',
                    });
                }
                console.log("success");
                return res.status(200).send(JSON.stringify(aire_parcelles));

            })
            .catch(error => res.status(400).send(error));
    },

    /**
     * recupérer la liste des appellations ayant le code insee
     * @param {*} req 
     * @param {*} res 
     */
    retrieveByInsee(req, res) {
        return Aire_P
            .findAll({
                where: {
                    insee: req.params.insee,
                },
            })
            .then(aire_parcelles => {
                if (!aire_parcelles) {
                    return res.status(404).send({
                        message: 'Appellation ayant le code Insee pas trouvé'
                    });
                }
                return res.status(200).send(aire_parcelles);
            })
            .catch(error => res.status(400).send(error));
    },

    /**
     * récuper l'extend d'une denomination/appellation
     * @param {*} req 
     * @param {*} res 
     */
    getExtend(req, res) {
        return sequelize
            .query("SELECT ST_XMIN(ST_EXTENT(aire_p.geom)), ST_YMIN(ST_EXTENT(aire_p.geom)), ST_XMAX(ST_EXTENT(aire_p.geom)), ST_YMAX(ST_EXTENT(aire_p.geom)) from  test.aire_p where denomination = $denom;",
                {
                    bind: { denom: req.params.denom },
                    type: Sequelize.QueryTypes.SELECT
                })
            .then(extend => {
                if (!extend) {
                    return res.status(404).send({
                        message: 'Not found'
                    });
                }
                return res.status(200).send(extend);
            })
            .catch(error => res.status(400).send(error));
    },


    /**
     * récupérer les couches chargées
     * @param {*} req 
     * @param {*} res 
     */
    getSess(req, res) {
        sess = req.session;
        if (typeof (sess.aire) == 'undefined') {
            sess.aire = [];
        }
        return res.status(200).send({ filter: sess.aire });
    },
    /**
     * delete a layer in session
     * @param {*} req 
     * @param {*} res 
     */
    delLayerSess(req, res) {
        console.log("DEBUT FONCTION SUPPRESSION COUCHE " + req.params.id);
        sess = req.session;
        if (typeof (sess.aire) !== 'undefined') {
            try {
                let removed = sess.aire.filter(el => el.id != req.params.id);
                sess.aire = removed;
                return res.status(200).send("sucesss");
            } catch (error) {
                res.status(400).send(error);
            }
        }
    }











}