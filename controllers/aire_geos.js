/**
 * @author JEAN ROGER NIGOUMI GUIALA
 * @description controlleur pour les aire géographique
 */

const Aire_Geo = require('../models').aire_geo;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var sess;



module.exports = {

    /**
     * Récupère une aire géographique en fonction de la dénomination
     * @param {*} req 
     * @param {*} res 
     */
    retrieveByDenom(req, res) {
        return Aire_Geo
            .findOne({
                raw: true,
                where: {
                    denomination: req.params.denomination,
                },
                attributes: { exclude: ['geom'] },

            })
            .then(aire_geo => {
                if (!aire_geo) {
                    return res.status(404).send({
                        message: 'denomination pas trouvé',
                    });
                }
                sess = req.session;
                if (typeof (sess.aire) == 'undefined') {
                    sess.aire = [];
                }
              
                return res.status(200).send({ aire_geo: aire_geo});
            })
            .catch(error => res.status(400).send(error));
    },

    /**
     * récuper l'extend d'une denomination/appellation
     * @param {*} req 
     * @param {*} res 
     */
    getAire(req, res) {
        return sequelize
            // .query("SELECT ST_XMIN(ST_EXTENT(aire_geo.geom)), ST_YMIN(ST_EXTENT(aire_geo.geom)), ST_XMAX(ST_EXTENT(aire_geo.geom)), ST_YMAX(ST_EXTENT(aire_geo.geom)) from  metier_inao.aire_geo where denomination = $denom;",
            .query("SELECT  ST_AsGeoJSON(aire_geo.geom) as geom from  metier_inao.aire_geo where denomination = $denom;",
                {
                    bind: { denom: req.params.denom },
                    type: Sequelize.QueryTypes.SELECT
                })
            .then(extend => {
                if (!extend) {
                    return res.status(404).send({
                        message: 'Not found'
                    });
                }else{
                  
                    return res.status(200).send(extend);}
                

            })
            .catch(error => res.status(400).send(error));
    },


};