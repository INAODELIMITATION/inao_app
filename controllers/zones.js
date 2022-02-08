/**
 * @file zone.js
 * @author JEAN ROGER NIGOUMI GUIALA
 */

const Zone = require('../models').v_lst_zone;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var sess;

module.exports = {

    findAireGeo(req,res){
        return Zone
        .findOne({
            where:{
                id_aire : req.params.id_aire,
                type_zone:1
            },
            attributes: { exclude: ['geom'] },
        })
        .then(aire_geo=>{
            if(!aire_geo){
                res.status(200).send(false);
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
    getAire(req, res) {
        console.log(req.params.id_aire);
        return sequelize
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
            .query("SELECT ST_XMIN(ST_EXTENT(ST_TRANSFORM(v_lst_zone.geom,3857))), ST_YMIN(ST_EXTENT(ST_TRANSFORM(v_lst_zone.geom,3857))), ST_XMAX(ST_EXTENT(ST_TRANSFORM(v_lst_zone.geom,3857))), ST_YMAX(ST_EXTENT(ST_TRANSFORM(v_lst_zone.geom,3857))) from  metier_inao.v_lst_zone where id_aire = $id_aire AND type_zone =$type_zone;",
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
    },

    listAppellationOncoord(req,res){
        return sequelize
        .query("SELECT DISTINCT vlst.lbl_aire,  vlst.id_aire"+
       " FROM metier_inao.v_lst_lbl_aire vlst"+
       " LEFT JOIN metier_inao.v_lst_zone vzone USING(id_aire)"+
        "WHERE ST_INTERSECTS(ST_TRANSFORM(ST_GEOMFROMTEXT('POINT("+req.params.x+" "+ req.params.y+")',3857),2154),vzone.geom);",{

            // bind:{
            //    X: req.params.x,
            //    Y:req.params.y 
            // },
             type: Sequelize.QueryTypes.SELECT
        })
        .then(list_appel=>{
            if(!list_appel){
                return res.status(404).send('aucune appellation');
            }else{
                return res.status(200).send(list_appel);
            }
        }).catch(error=>res.status(400).send(error));
    }

};