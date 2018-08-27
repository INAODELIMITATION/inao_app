'use strict';
module.exports = (sequelize, DataTypes) => {
  var Aire_geo = sequelize.define('Aire_geo', {
    signe: DataTypes.STRING,
    id_app: DataTypes.INTEGER,
    id_denom: DataTypes.INTEGER,
    denomination: DataTypes.STRING,
    url_fiche: DataTypes.STRING,
    url_cdc: DataTypes.STRING,
    geom: DataTypes.GEOMETRY('MULTIPOLYGON',2154)
  }, {});
  Aire_geo.associate = function(models) {
    // associations can be defined here
  };
  return Aire_geo;
};