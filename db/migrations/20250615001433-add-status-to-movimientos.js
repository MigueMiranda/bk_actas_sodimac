'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('movimientos', 'estado_asignacion', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    });
  },

  down: async (queryInterface) => {
    return queryInterface.removeColumn('movimientos', 'estado_asignacion');
  }
};