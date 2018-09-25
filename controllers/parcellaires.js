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
function setParams(type, valeur, id_denom) {
    var tab = {
        type: type,
        valeur: valeur,
        id: id_denom,
    };
    console.log("ici");
    return tab;
}
module.exports = {




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
     * cette fonction ne fonctionne pas encore
     * @param {*} req 
     * @param {*} res 
     */
    changeSess(req, res) {
        sess = req.session;
        corps = JSON.parse(req.body.session)
        console.log(typeof req.body.session);
        console.log(typeof corps)
        console.log(corps);
        if (typeof (sess.aire) == 'undefined') {
            sess.aire = [];
        }
        sess.aire = corps;
        return res.status(200).send({ filter: sess.aire });
    },

    /**
     * delete a layer in session
     * @param {*} req 
     * @param {*} res 
     */
    delLayerSess(req, res) {
        console.log("DEBUT FONCTION SUPPRESSION COUCHE " + req.params.data);
        sess = req.session;
        if (typeof (sess.aire) !== 'undefined') {
            try {
                let removed = sess.aire.filter(el => el.id != req.params.data);
                sess.aire = removed;
                return res.status(200).send("sucesss");
            } catch (error) {
                res.status(400).send(error);
            }
        }
    }











}