'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('movimientos', 'token', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
  },

  down: async (queryInterface) => {
    return queryInterface.removeColumn('movimientos', 'token');
  }
};
