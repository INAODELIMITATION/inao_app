'use strict';
module.exports = (sequelize, DataTypes) => {
  var Parcelle = sequelize.define('t_parcelle', {
    idu: DataTypes.STRING,
    insee: DataTypes.STRING,
    dep: DataTypes.STRING,
    commune: DataTypes.STRING,
    section: DataTypes.STRING,
    numpar: DataTypes.INTEGER,
    geom: DataTypes.GEOMETRY('MULTIPOLYGON',2154)
  },
   {
    timestamps: false, //n'ajoute pas les attributs createdAt et updatedAt
    freezeTableName: true, // n'ajoute pas de s au nom de la table
    schema:'ign_bd_cadastre',
   });
  Parcelle.associate = function(models) {
    // associations can be defined here
  };
  return Parcelle;
};