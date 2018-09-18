'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('zone', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_zone: {
        type: Sequelize.INTEGER
      },
      lbl_aire_geo: {
        type: Sequelize.STRING
      },
      id_type_zone: {
        type: Sequelize.INTEGER
      },
      geom: {
        type: Sequelize.GEOMETRY('MULTIPOLYGON',2154)
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('zone');
  }
};