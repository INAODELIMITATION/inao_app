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