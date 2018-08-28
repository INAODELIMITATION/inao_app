'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('aire_geo', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      signe: {
        type: Sequelize.STRING
      },
      id_app: {
        type: Sequelize.INTEGER
      },
      id_denom: {
        type: Sequelize.INTEGER
      },
      denomination: {
        type: Sequelize.STRING
      },
      url_fiche: {
        type: Sequelize.STRING
      },
      url_cdc: {
        type: Sequelize.STRING
      },
      geom: {
        type: Sequelize.GEOMETRY('MULTIPOLYGON',2154)
      },
      
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('aire_geo');
  }
};