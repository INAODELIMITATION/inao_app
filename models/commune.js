'use strict';
module.exports = (sequelize, DataTypes) => {
  var Commune = sequelize.define('commune', {
    nom_officiel: DataTypes.STRING(46),
    code_insee: DataTypes.STRING(5),
    geom: DataTypes.GEOMETRY('MULTIPOLYGON',2154)
  }, 
  {
    timestamps: false, //n'ajoute pas les attributs createdAt et updatedAt
    freezeTableName: true, // n'ajoute pas de s au nom de la table
    schema:'new_data',
    table_name:'ign_adminexpress_commune_2025'
  });
  Commune.associate = function(models) {
    // associations can be defined here
  };
  return Commune;
};