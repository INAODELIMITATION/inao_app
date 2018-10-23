/**
 * @file Modele pour la table requete
 *  @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @version 1.0.0
 */
'use strict';
module.exports = (sequelize, DataTypes) => {
  var Request = sequelize.define('t_request', {
    id_aire: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    id_user: DataTypes.INTEGER
  },
    {
      timestamps: false, //n'ajoute pas les attributs createdAt et updatedAt
      freezeTableName: true, // n'ajoute pas de s au nom de la table
      schema: 'metier_inao',
    });
  Request.associate = function (models) {
    // associations can be defined here
  };
  return Request;
};