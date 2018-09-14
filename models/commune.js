'use strict';
module.exports = (sequelize, DataTypes) => {
  var Commune = sequelize.define('commune', {
    nom_com: DataTypes.STRING,
    code_insee: DataTypes.STRING,
    geom: DataTypes.GEOMETRY('MULTIPOLYGON',2154)
  }, 
  {
    timestamps: false, //n'ajoute pas les attributs createdAt et updatedAt
    freezeTableName: true, // n'ajoute pas de s au nom de la table
    schema:'ign_bd_cadastre',
  });
  Commune.associate = function(models) {
    // associations can be defined here
  };
  return Commune;
};