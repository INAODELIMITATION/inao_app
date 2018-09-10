'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('commune', {
      type: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.STRING
      },
      nom_com: {
        type: Sequelize.STRING
      },
      code_insee: {
        type: Sequelize.STRING
      },
     
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('commune');
  }
};