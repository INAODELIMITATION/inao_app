/**
 * @file libelleAire Controlleur pour le modele libelleaire
 * @author Guiala Jean Roger
 * @version 1.0.0
 * @description Dans ce fichier nous mettrons toutes les fonctions pour recupérer/modifier les valeurs de notre modèle
 */

const lbl_Aire = require('../models').v_lst_lbl_aire;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);



module.exports = {

    /**
     * @method findLibelle
     * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
     * @description ensemble des denomination qui correspondent a ce qui a été rentré par l'utilisateur
     * @param {*} req 
     * @param {*} res 
     */
    findLibelle(req, res) {
        console.log("debut");
        return sequelize
            .query("SELECT *" +
                " FROM " +
                "(SELECT id_aire, lbl_aire " +
                "FROM metier_inao.v_lst_lbl_aire " +
                "WHERE similarity(lbl_aire, $libelle) >$similaire " +
                "ORDER BY similarity(lbl_aire, $libelle) DESC " +
                "LIMIT 20) requete " +
                "ORDER BY lbl_aire ",
                {
                    bind: {
                        libelle: req.body.libelle,
                        similaire: 0.20
                    },
                    type: Sequelize.QueryTypes.SELECT
                })
            .then(lbl_Aires => {
                console.log(lbl_Aires);
                if (!lbl_Aires) {
                    return res.status(404).send({
                        message: 'denomination pas trouvé',
                    });
                }//comment

                return res.status(200).send(JSON.stringify(lbl_Aires));
            })
            .catch(error => res.status(400).send(error));

    }


};