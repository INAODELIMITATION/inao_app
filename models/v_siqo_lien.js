'use strict';
module.exports = (sequelize, DataTypes) => {
  var V_siqo_lien = sequelize.define('v_siqo_lien', {
    id_aire:{
      type: DataTypes.INTEGER,
      primaryKey:true
    },
    lien_reglement: DataTypes.STRING
  }, 
  {
    timestamps: false, //n'ajoute pas les attributs createdAt et updatedAt
    freezeTableName: true, // n'ajoute pas de s au nom de la table
    schema:'metier_inao',
  });
  V_siqo_lien.associate = function(models) {
    // associations can be defined here
    //commentaire
  };
  return V_siqo_lien;
};