'use strict';
module.exports = (sequelize, DataTypes) => {
  var Parcelle = sequelize.define('parcelle', {
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
    schema:'app',
   });
  Parcelle.associate = function(models) {
    // associations can be defined here
  };
  return Parcelle;
};