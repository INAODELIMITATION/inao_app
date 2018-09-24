'use strict';
module.exports = (sequelize, DataTypes) => {
  var Zone = sequelize.define('v_lst_zone', {
    id_zone: DataTypes.INTEGER,
    type_zone: DataTypes.INTEGER,
    id_aire: DataTypes.INTEGER,
    lbl_aire: DataTypes.STRING,
    insee: DataTypes.STRING,
    nomcom: DataTypes.STRING,
    geom: DataTypes.GEOMETRY('MULTIPOLYGON',2154)
  }, 
  {
    timestamps: false, //n'ajoute pas les attributs createdAt et updatedAt
    freezeTableName: true, // n'ajoute pas de s au nom de la table
    schema:'metier_inao',
  });
  Zone.associate = function(models) {
    // associations can be defined here
  };
  return Zone;
};