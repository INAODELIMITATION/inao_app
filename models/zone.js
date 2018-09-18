'use strict';
module.exports = (sequelize, DataTypes) => {
  var zone = sequelize.define('zone', {
    id_zone: DataTypes.INTEGER,
    lbl_aire_geo: DataTypes.STRING,
    id_type_zone: DataTypes.INTEGER,
    geom: DataTypes.GEOMETRY('MULTIPOLYGON',2154)
  }, 
  {
    timestamps: false, //n'ajoute pas les attributs createdAt et updatedAt
    freezeTableName: true, // n'ajoute pas de s au nom de la table
    schema:'metier_inao',
  });
  zone.associate = function(models) {
    // associations can be defined here
  };
  return zone;
};