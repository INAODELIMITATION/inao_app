'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Aire_geos', {
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
        type: Sequelize.GEOMETRY
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Aire_geos');
  }
};