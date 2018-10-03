'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('user', {
    login: DataTypes.STRING,
    mdp: DataTypes.STRING,
    last_connection: DataTypes.DATE
  }, 
  {
    timestamps: false, //n'ajoute pas les attributs createdAt et updatedAt
    freezeTableName: true, // n'ajoute pas de s au nom de la table
    schema:'app',
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};