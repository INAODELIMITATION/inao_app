'use strict';
module.exports = (sequelize, DataTypes) => {
  var libelleAire = sequelize.define('v_lst_lbl_aire', {
    id_aire:DataTypes.INTEGER,
    lbl_aire: DataTypes.STRING
  }, 
  {
    timestamps: false, //n'ajoute pas les attributs createdAt et updatedAt
    freezeTableName: true, // n'ajoute pas de s au nom de la table
    schema:'metier_inao',
  });
  libelleAire.associate = function(models) {
    // associations can be defined here
  };
  return libelleAire;
};