/**
 * @file modele pour la table t_user
 *  @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @version 1.0.0
 */
'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('t_user', {
    login: DataTypes.STRING,
    mdp: DataTypes.STRING,
    last_connection: DataTypes.DATE
  }, 
  {
    timestamps: false, //n'ajoute pas les attributs createdAt et updatedAt
    freezeTableName: true, // n'ajoute pas de s au nom de la table
    schema:'metier_inao',
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};