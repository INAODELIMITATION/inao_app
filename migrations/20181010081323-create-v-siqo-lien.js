'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('V_siqo_lien', {
      id_aire: {
        type: Sequelize.INTEGER
      },
      lien_reglement: {
        type: Sequelize.STRING
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('V_siqo_lien');
  }
};