'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('asignaciones', 'token_expire', {
    //   type: Sequelize.DATE,
    //   allowNull: true,
    // });
    await queryInterface.addColumn('movimientos', 'ubicacion_elemento', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.removeColumn('asignaciones', 'token_expire');
    await queryInterface.removeColumn('movimientos', 'ubicacion_elemento');
  },
};
