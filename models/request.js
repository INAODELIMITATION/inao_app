'use strict';
module.exports = (sequelize, DataTypes) => {
  var Request = sequelize.define('request', {
    id_aire: DataTypes.INTEGER,
    date: DataTypes.DATE,
    id_user: DataTypes.INTEGER
  }, 
  {
    timestamps: false, //n'ajoute pas les attributs createdAt et updatedAt
    freezeTableName: true, // n'ajoute pas de s au nom de la table
    schema:'app',
  });
  Request.associate = function(models) {
    // associations can be defined here
  };
  return Request;
};