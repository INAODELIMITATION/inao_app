'use strict';
module.exports = (sequelize, DataTypes) => {
  var Parcelle = sequelize.define('parcelle', {
    idu: DataTypes.STRING(200),
    insee: DataTypes.STRING(200),
    dep: DataTypes.TEXT,
    commune: DataTypes.TEXT,
    section: DataTypes.STRING(200),
    numpar: DataTypes.STRING(200),
    geom: DataTypes.GEOMETRY('MULTIPOLYGON',2154)
  },
   {
    timestamps: false, //n'ajoute pas les attributs createdAt et updatedAt
    freezeTableName: true, // n'ajoute pas de s au nom de la table
    schema:'metier_inao',
   });
  Parcelle.associate = function(models) {
    // associations can be defined here
  };
  return Parcelle;
};