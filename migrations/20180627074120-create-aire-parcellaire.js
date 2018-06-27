'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('aire_parcellaire', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      new_insee: {
        type: Sequelize.STRING
      },
      new_nomcom: {
        type: Sequelize.STRING
      },
      old_insee: {
        type: Sequelize.STRING
      },
      old_nomcom: {
        type: Sequelize.STRING
      },
      type_ig: {
        type: Sequelize.STRING
      },
      id_app: {
        type: Sequelize.INTEGER
      },
      appellation: {
        type: Sequelize.STRING
      },
      id_denom: {
        type: Sequelize.INTEGER
      },
      denomination: {
        type: Sequelize.STRING
      },
      geom: {
        type: Sequelize.GEOMETRY('MULTIPOLYGON',2154)
      },
      crinao: {
        type: Sequelize.STRING
      },
     
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Aire_Parcellaire');
  }
};