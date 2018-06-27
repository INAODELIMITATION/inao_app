'use strict';
module.exports = (sequelize, DataTypes) => {
  var Aire_Parcellaire = sequelize.define('aire_parcellaire', {
    new_insee: DataTypes.STRING,
    new_nomcom: DataTypes.STRING,
    old_insee: DataTypes.STRING,
    old_nomcom: DataTypes.STRING,
    type_ig: DataTypes.STRING,
    id_app: DataTypes.INTEGER,
    appellation: DataTypes.STRING,
    id_denom: DataTypes.INTEGER,
    denomination: DataTypes.STRING,
    geom: DataTypes.GEOMETRY('MULTIPOLYGON',2154),
    crinao: DataTypes.STRING
  }, {
    timestamps: false, //n'ajoute pas les attributs createdAt et updatedAt
    freezeTableName: true, // n'ajoute pas de s au nom de la table
    schema:'metier_inao',
  });
  Aire_Parcellaire.associate = function(models) {
    // associations can be defined here
  };
  return Aire_Parcellaire;
};