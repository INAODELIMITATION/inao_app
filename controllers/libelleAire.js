/**
 * @author JEAN ROGER NIGOUMI GUIALA
 * @description controlleur pour les libelle aire
 */

const lbl_Aire = require('../models').v_lst_lbl_aire;
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
    return tab;
}
module.exports = {

    /**
     * ensemble des denomination qui correspondent a ce qui a été rentré par l'utilisateur
     * @param {*} req 
     * @param {*} res 
     */
    findLibelle(req,res){
        console.log("Début de la fonction FindLibelle");
        return lbl_Aire
        .findAll({
            raw:true,
            where:{
                lbl_aire : { [Op.iLike]: '%' + req.body.libelle + '%' }
            },
            limit: 30,
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('id_aire')), 'id_aire'],'lbl_aire'],
        })
        .then(lbl_Aires =>{
            if (!lbl_Aires) {
                return res.status(404).send({
                    message: 'denomination pas trouvé',
                });
            }
            console.log("success");
            return res.status(200).send(JSON.stringify(lbl_Aires));
        })
        .catch(error => res.status(400).send(error));

    }


};