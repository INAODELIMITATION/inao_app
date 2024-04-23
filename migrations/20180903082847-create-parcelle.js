'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('parcelle', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idu: {
        type: Sequelize.STRING
      },
      insee: {
        type: Sequelize.STRING
      },
      dep: {
        type: Sequelize.STRING
      },
      commune: {
        type: Sequelize.STRING
      },
      section: {
        type: Sequelize.STRING
      },
      numpar: {
        type: Sequelize.INTEGER
      },
      geom: {
        type: Sequelize.GEOMETRY('MULTIPOLYGON',2154)
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('parcelle');
  }
};