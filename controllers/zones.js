/**
 * @author JEAN ROGER NIGOUMI GUIALA
 * @description controlleur pour les libelle aire
 */

const Zone = require('../models').v_lst_zone;
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

    findAireGeo(req,res){
        return Zone
        .findOne({
            raw:true,
            where:{
                id_aire: req.params.id_aire,
                type_zone:1
            }
        })
        .then(aire_geo=>{
            if(!aire_geo){
                return res.status(404).send({
                    message: "pas trouvé"
                });
            }
            sess = req.session;
            if (typeof (sess.aire) == 'undefined') {
                sess.aire = [];
            }
            return res.status(200).send(aire_geo);
        })
        .catch(error=>res.status(400).send(error));
    },
    /**
     * récuper l'extend d'une denomination/appellation
     * @param {*} req 
     * @param {*} res 
     */
    getAire(req, res) {
        console.log(req.params.id_aire);
        return sequelize
            // .query("SELECT ST_XMIN(ST_EXTENT(aire_geo.geom)), ST_YMIN(ST_EXTENT(aire_geo.geom)), ST_XMAX(ST_EXTENT(aire_geo.geom)), ST_YMAX(ST_EXTENT(aire_geo.geom)) from  metier_inao.aire_geo where denomination = $denom;",
            .query("SELECT v_lst_zone.id_aire, v_lst_zone.lbl_aire, ST_AsGeoJSON(v_lst_zone.geom) as geom from  metier_inao.v_lst_zone where id_aire = $id_aire AND type_zone=$type_zone LIMIT 1;",
                {
                    bind: { 
                        id_aire: req.params.id_aire,
                        type_zone:1
                    },
                    type: Sequelize.QueryTypes.SELECT
                })
            .then(aire_geo => {
                if (aire_geo.length == 0) {
                    return res.status(200).send(false);
                }else{
                  
                    return res.status(200).send(aire_geo);
                }
                

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
            .query("SELECT ST_XMIN(ST_EXTENT(v_lst_zone.geom)), ST_YMIN(ST_EXTENT(v_lst_zone.geom)), ST_XMAX(ST_EXTENT(v_lst_zone.geom)), ST_YMAX(ST_EXTENT(v_lst_zone.geom)) from  metier_inao.v_lst_zone where id_aire = $id_aire AND type_zone =$type_zone;",
                {
                    bind: {
                         id_aire: req.params.id_aire ,
                         type_zone: 2,
                        },
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

    getParcellaire(req,res){
        return Zone
        .findOne({
            where:{
                id_aire : req.params.id_aire,
                type_zone:2
            },
            attributes: { exclude: ['geom'] },
        })
        .then(aire_parcellaire=>{
            if(!aire_parcellaire){
                res.status(200).send(false);
            }else{
                return res.status(200).send(aire_parcellaire);
            }
           
        })
        .catch(error => res.status(400).send(error));
    }

};