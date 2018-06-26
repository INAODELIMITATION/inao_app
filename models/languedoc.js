'use strict';
module.exports = (sequelize, DataTypes) => {
  var Languedoc = sequelize.define('languedoc', {
    insee: DataTypes.STRING,
    denomination: DataTypes.STRING,
    geom: DataTypes.GEOMETRY('MULTIPOLYGON',2154)
  }, {
    timestamps: false, //n'ajoute pas les attributs createdAt et updatedAt
    freezeTableName: true, // n'ajoute pas de s au nom de la table
    schema:'test',
  });
  Languedoc.associate = function(models) {
    // associations can be defined here
  };
  return Languedoc;
};