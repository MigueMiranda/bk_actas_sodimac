'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('movimientos', 'token');

    await queryInterface.addColumn('movimientos', 'estado_elemento', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('movimientos', 'tienda_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('movimientos', 'token', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });

    await queryInterface.removeColumn('movimientos', 'estado_elemento');
    await queryInterface.removeColumn('movimientos', 'tienda_id');
  },
};

