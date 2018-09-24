'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('v_lst_zone', {
    
      id_zone: {
        type: Sequelize.INTEGER
      },
      type_zone: {
        type: Sequelize.INTEGER
      },
      id_aire: {
        type: Sequelize.INTEGER
      },
      lbl_aire: {
        type: Sequelize.STRING
      },
      insee: {
        type: Sequelize.STRING
      },
      nomcom: {
        type: Sequelize.STRING
      },
      geom: {
        type: Sequelize.GEOMETRY
      },
      
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('v_lst_zone');
  }
};