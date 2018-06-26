'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('languedoc', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      insee: {
        type: Sequelize.STRING
      },
      denomination: {
        type: Sequelize.STRING
      },
      geom: {
        type: Sequelize.GEOMETRY('MULTIPOLYGON',2154)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },{
      schema:'test',
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('languedoc');
  }
};